// سكريبت لإضافة vignette مباشرة إلى قاعدة البيانات
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const Vignette = require('../src/models/Administratif'); // تأكد أن هذا هو الموديل الصحيح

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const vignette = new Vignette({
    type: 'vignette',
    reference: 'TEST-123',
    vehicle: null, // ضع هنا ObjectId لمركبة موجودة إذا أردت ربطها
    dateEmission: new Date('2026-03-08'),
    dateExpiration: new Date('2027-03-08'),
    montantPrincipal: 1000,
    penalite: 0,
    majoration: 0,
    fraisService: 0,
    timbre: 0,
    tvaFraisService: 0,
    montant: 1000,
    notes: 'تمت الإضافة بالسكريبت',
    agencyId: 'AGENCY_ID', // ضع هنا الـ agencyId الصحيح إذا كان مطلوبًا
  });

  await vignette.save();
  console.log('تمت إضافة vignette بنجاح:', vignette);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('خطأ أثناء الإضافة:', err);
  process.exit(1);
});
