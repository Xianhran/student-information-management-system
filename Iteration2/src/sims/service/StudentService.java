package sims.service;

import sims.common.DuplicateEntryException;
import sims.common.EntityNotFoundException;
import sims.common.Validator;
import sims.model.Student;
import sims.repository.CsvEnrollmentRepository;
import sims.repository.CsvStudentRepository;

import java.util.List;

public class StudentService {
    private CsvStudentRepository studentRepo = new CsvStudentRepository();
    private CsvEnrollmentRepository enrollmentRepo = new CsvEnrollmentRepository();

    public void addStudent(String id, String name) throws DuplicateEntryException {
        Validator.validateStudentId(id);
        if (studentRepo.findById(id) != null) {
            throw new DuplicateEntryException("Student ID already exists: " + id);
        }
        studentRepo.save(new Student(id, name));
    }

    public void updateStudent(String id, String name) throws EntityNotFoundException {
        Validator.validateStudentId(id);
        if (studentRepo.findById(id) == null) {
            throw new EntityNotFoundException("Student ID not found: " + id);
        }
        studentRepo.update(new Student(id, name));
    }

    public void deleteStudent(String id) throws EntityNotFoundException {
        if (studentRepo.findById(id) == null) {
            throw new EntityNotFoundException("Student ID not found: " + id);
        }
        enrollmentRepo.deleteByStudentId(id);
        studentRepo.delete(id);
    }

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public Student searchStudent(String id) {
        return studentRepo.findById(id);
    }
}
