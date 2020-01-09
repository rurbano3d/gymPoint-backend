import * as Yup from 'yup';
import Help_order from '../models/Help_order';
import Student from '../models/Student';

class Help_orderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const help_orders = await Help_order.findAll({
      where: { student_id: req.params.student_id },
      limit: 5,
      offset: (page - 1) * 5,
      order: [['id', 'desc']],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(help_orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, student_id, question } = await Help_order.create(req.body);
    return res.json({
      id,
      student_id,
      question,
    });
  }

  async delete(req, res) {
    const order = await Help_order.findByPk(req.params.id);

    await order.destroy();

    return res.send(order);
  }
}

export default new Help_orderController();
