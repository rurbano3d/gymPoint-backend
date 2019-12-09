import { startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const checkins = await Checkin.findAll({
      where: { student_id: req.params.student_id },
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json({
      checkins,
    });
  }

  async store(req, res) {
    const currentDate = new Date();
    const startWeek = startOfWeek(currentDate);
    const endWeek = endOfWeek(currentDate);
    /* const checkinToday = await Checkin.findAndCountAll({
      where: {
        student_id: req.params.student_id,
        created_at: {[Op.gte]:currentDate},
        created_at: {[Op.lte]:currentDate}
        },
        order:['created_at']
       });
       console.log(checkinToday);
       if (checkinToday.count >= 1) {
        return res.status(401).json({
          error: 'Dialy checkin exceeded, you can only do 1 checkin per day',
        });
      } */
    const checkinLimit = await Checkin.findAndCountAll({
      where: {
        student_id: req.params.student_id,
        created_at: { [Op.between]: [startWeek, endWeek] },
      },
      order: ['created_at'],
    });

    if (checkinLimit.count >= 5) {
      return res.status(401).json({
        error: 'Week checkin exceeded, you can only do 5 checkins per week',
      });
    }

    const { student_id } = await Checkin.create({
      student_id: req.params.student_id,
    });
    return res.json({
      student_id,
    });
  }
}
export default new CheckinController();
