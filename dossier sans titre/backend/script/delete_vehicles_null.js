// script/delete_vehicles_null.js
// سكريبت لحذف جميع المركبات التي matricule=null أو غير موجودة من جميع القواعد

const mongoose = require('mongoose');
const Vehicle = require('../src/models/Vehicle');

// تأكد أن اسم القاعدة في الرابط هو arwapark وليس test
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://advicermano_db_tinljdid:qdK6aAF1rzY0Cn5e@cluster0.t3zjffy.mongodb.net/arwapark?retryWrites=true&w=majority';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('تم الاتصال بقاعدة البيانات');

  // حذف جميع المركبات التي matricule=null أو فارغة أو غير موجودة
  const result = await Vehicle.deleteMany({ $or: [ { matricule: null }, { matricule: '' }, { matricule: { $exists: false } } ] });
  console.log(`تم حذف ${result.deletedCount} مركبة فيها matricule=null أو فارغ أو غير موجود`);
  process.exit(0);
}

main().catch(err => {
  console.error('حدث خطأ:', err);
  process.exit(1);
});
