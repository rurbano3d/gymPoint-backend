import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const {
      name,
      email,
      title,
      start_date,
      newEndDate,
      duration,
      price,
    } = data;

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
        end_date: format(parseISO(newEndDate), " dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        duration,
        price,
      },
    });
  }
}

export default new RegistrationMail();
