import { parseISO, addMonths, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as Yup from 'yup';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const registrations = await Registration.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });
    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const { name, email } = await Student.findOne({
      where: { id: student_id },
    });

    const { title, duration, price } = await Plan.findOne({
      where: { id: plan_id },
    });

    const newPrice = duration * price;

    const newEndDate = addMonths(parseISO(start_date), duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date: newEndDate,
      price: newPrice,
    });

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Matrícula na GymPoint',
      template: 'registration',
      context: {
        student: name,
        plan: title,
        start_date: format(parseISO(start_date), " dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        end_date: format(newEndDate, " dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        duration,
        price,
      },
    });

    return res.json({ registration });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const registration = await Registration.findByPk(req.params.id);

    const { student_id, plan_id, start_date } = req.body;

    const { name, email } = await Student.findOne({
      where: { id: student_id },
    });

    const { title, duration, price } = await Plan.findOne({
      where: { id: plan_id },
    });

    const newPrice = duration * price;

    const newEndDate = addMonths(parseISO(start_date), duration);

    const updateRegistration = await registration.update({
      student_id,
      plan_id,
      start_date,
      end_date: newEndDate,
      price: newPrice,
    });

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Alteração de matrícula na GymPoint',
      template: 'registration',
      context: {
        student: name,
        plan: title,
        start_date: format(parseISO(start_date), " dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        end_date: format(newEndDate, " dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        duration,
        price,
      },
    });
    return res.json({ updateRegistration });
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    await registration.destroy();

    return res.send();
  }
}

export default new RegistrationController();
