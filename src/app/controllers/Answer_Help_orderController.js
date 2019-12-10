import * as Yup from 'yup';
import Help_order from '../models/Help_order';
import Student from '../models/Student';

import Help_orderMail from '../jobs/Help_orderMail';
import Queue from '../../lib/Queue';

class Help_orderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const help_orders = await Help_order.findAll({
      where: { answer: null },
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(help_orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const help_order = await Help_order.findByPk(req.params.id);

    const { answer } = req.body;

    const { name, email } = await Student.findByPk(help_order.student_id);

    const { answer_at } = await help_order.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(Help_orderMail.key, {
      student: name,
      email,
      question: help_order.question,
      answer,
    });
    console.log(name);
    return res.json({
      answer,
      answer_at,
    });
  }
}

export default new Help_orderController();
