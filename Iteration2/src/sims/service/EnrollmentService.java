package sims.service;

import sims.common.DuplicateEnrollmentException;
import sims.common.EntityNotFoundException;
import sims.common.Validator;
import sims.model.Enrollment;
import sims.repository.CsvCourseRepository;
import sims.repository.CsvEnrollmentRepository;
import sims.repository.CsvStudentRepository;

import java.util.List;

public class EnrollmentService {
    private CsvEnrollmentRepository enrollmentRepo = new CsvEnrollmentRepository();
    private CsvStudentRepository studentRepo = new CsvStudentRepository();
    private CsvCourseRepository courseRepo = new CsvCourseRepository();

    public void enroll(String studentId, String courseCode) throws EntityNotFoundException, DuplicateEnrollmentException {
        Validator.validateStudentId(studentId);
        Validator.validateCourseCode(courseCode);
        if (studentRepo.findById(studentId) == null) {
            throw new EntityNotFoundException("Student not found: " + studentId);
        }
        if (courseRepo.findByCode(courseCode) == null) {
            throw new EntityNotFoundException("Course not found: " + courseCode);
        }
        if (enrollmentRepo.exists(studentId, courseCode)) {
            throw new DuplicateEnrollmentException("Student already enrolled in this course");
        }
        enrollmentRepo.save(new Enrollment(studentId, courseCode));
    }

    public void drop(String studentId, String courseCode) throws EntityNotFoundException {
        if (!enrollmentRepo.exists(studentId, courseCode)) {
            throw new EntityNotFoundException("Enrollment record not found");
        }
        enrollmentRepo.delete(studentId, courseCode);
    }

    public List<Enrollment> getEnrollmentsByStudent(String studentId) {
        return enrollmentRepo.findByStudentId(studentId);
    }

    public List<Enrollment> getStudentsByCourse(String courseCode) {
        return enrollmentRepo.findByCourseCode(courseCode);
    }
}
