import * as Yup from 'yup';
import Help_order from '../models/Help_order';

class Help_orderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const help_orders = await Help_order.findAll({
      where: { id: req.params.student_id },
      limit: 20,
      offset: (page - 1) * 20,
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
}

export default new Help_orderController();
