import Mail from '../../lib/Mail';

class Help_orderMail {
  get key() {
    return 'Help_orderMail';
  }

  async handle({ data }) {
    const { student, email, question, answer } = data;

    await Mail.sendMail({
      to: `${student} <${email}>`,
      subject: 'Dúvida respondida na GymPoint',
      template: 'help_order',
      context: {
        student,
        question,
        answer,
      },
    });
  }
}

export default new Help_orderMail();
