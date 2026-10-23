package sims.service;

import sims.common.DuplicateEntryException;
import sims.common.EntityNotFoundException;
import sims.common.Validator;
import sims.model.Course;
import sims.repository.CsvCourseRepository;
import sims.repository.CsvEnrollmentRepository;

import java.util.List;

public class CourseService {
    private CsvCourseRepository courseRepo = new CsvCourseRepository();
    private CsvEnrollmentRepository enrollmentRepo = new CsvEnrollmentRepository();

    public void addCourse(String code, String title) throws DuplicateEntryException {
        Validator.validateCourseCode(code);
        if (courseRepo.findByCode(code) != null) {
            throw new DuplicateEntryException("Course code already exists: " + code);
        }
        courseRepo.save(new Course(code, title));
    }

    public void updateCourse(String code, String title) throws EntityNotFoundException {
        Validator.validateCourseCode(code);
        if (courseRepo.findByCode(code) == null) {
            throw new EntityNotFoundException("Course code not found: " + code);
        }
        courseRepo.update(new Course(code, title));
    }

    public void deleteCourse(String code) throws EntityNotFoundException {
        if (courseRepo.findByCode(code) == null) {
            throw new EntityNotFoundException("Course code not found: " + code);
        }
        enrollmentRepo.deleteByCourseCode(code);
        courseRepo.delete(code);
    }

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }
}
