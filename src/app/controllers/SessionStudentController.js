import Student from '../models/Student';

class SessionStudentController {
  async store(req, res) {
    const { id } = req.body;
    const student = await Student.findByPk(id);
    if (!student) return res.status(401).json({ error: 'Student not found' });

    return res.json(student);
  }
}

export default new SessionStudentController();
