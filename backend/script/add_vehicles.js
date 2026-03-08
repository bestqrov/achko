// script/add_vehicles.js
// هذا السكريبت يحذف جميع المركبات ويضيف مركبتين جديدتين تلقائياً

const mongoose = require('mongoose');
const Vehicle = require('../src/models/Vehicle');
const Agency = require('../src/models/Agency');

// تأكد أن اسم القاعدة في الرابط هو arwapark وليس test
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://advicermano_db_tinljdid:qdK6aAF1rzY0Cn5e@cluster0.t3zjffy.mongodb.net/arwapark?retryWrites=true&w=majority';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('تم الاتصال بقاعدة البيانات');


  // حذف جميع المركبات التي matricule=null أو فارغة أو غير موجودة
  await Vehicle.deleteMany({ $or: [ { matricule: null }, { matricule: '' }, { matricule: { $exists: false } } ] });
  console.log('تم حذف جميع المركبات التي matricule=null أو فارغة أو غير موجودة');

  // جلب أول وكالة (agency) موجودة
  const agency = await Agency.findOne();
  if (!agency) {
    console.error('لا توجد أي وكالة (Agency) في قاعدة البيانات!');
    process.exit(1);
  }

  // إضافة مركبتين جديدتين
  const vehicles = [
    {
      agencyId: agency._id,
      designation: 'سيارة اختبار 1',
      immatricule: 'TEST-001',
      typeAcquisition: 'Achat',
      modele: 'موديل 1',
      couleur: 'أحمر',
      status: 'available',
    },
    {
      agencyId: agency._id,
      designation: 'سيارة اختبار 2',
      immatricule: 'TEST-002',
      typeAcquisition: 'Leasing',
      modele: 'موديل 2',
      couleur: 'أزرق',
      status: 'in_use',
    },
  ];

  await Vehicle.insertMany(vehicles);
  console.log('تمت إضافة مركبتين بنجاح');
  process.exit(0);
}

main().catch(err => {
  console.error('حدث خطأ:', err);
  process.exit(1);
});
