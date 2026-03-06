'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Phone, Mail, MapPin, Calendar,
  Briefcase, Hash, Flag, Users2, Building2, Tag, CreditCard,
  Home, GraduationCap, Ruler, Car, Landmark, AlertCircle,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  // Identité
  matricule: '',
  typePiece: '',
  numeroPiece: '',
  finValiditeCin: '',
  prenom: '',
  nom: '',
  dateNaissance: '',
  lieuNaissance: '',
  ville: '',
  nationalite: '',
  situationFamiliale: '',
  nombreEnfants: '',
  sexe: '',
  codePostal: '',
  adresse: '',
  // Situation collaborateur
  direction: '',
  flotte: '',
  categorie: '',
  situationCollaborateur: '',
  situationCNSS: '',
  dateEntree: '',
  dateArretTravail: '',
  motifDepart: '',
  cnss: '',
  cimr: '',
  dateAnticipeeRetraite: '',
  dateDebut: '',
  compteComptaireAux: '',
  // Contact
  telPortableProf: '',
  telPortablePerso: '',
  telFixeProf: '',
  telFixePerso: '',
  emailProf: '',
  emailPerso: '',
  nomContact1: '',
  telContact1: '',
  nomContact2: '',
  telContact2: '',
  // Expériences
  niveauEtudes: '',
  experiencePro: '',
  formationsDiplomes: '',
  ancienEmployeur: '',
  // Autres
  pointureChaussures: '',
  taille: '',
  personnelAtelier: '',
  chauffeur: '',
  nomBanque: '',
  numeroCompte: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'matricule', label: 'Matricule' },
  { key: 'nom',       label: 'Nom' },
  { key: 'prenom',    label: 'Prénom' },
  { key: 'direction', label: 'Direction' },
  { key: 'dateEntree', label: 'Date entrée', render: (v: string) => formatDate(v) },
  { key: 'situationCollaborateur', label: 'Situation' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">{children}</p>;
}

function F({ label, icon: Icon, color, children }: { label: string; icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
        {label}
      </label>
      {children}
    </div>
  );
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50';
const sel = inp;

export default function CollaborateursPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'collaborateur' });
  const create              = useCreateResource('gestion');

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(EMPTY_FORM); setView('list'); };
  const handleSubmit = async () => {
    await create.mutateAsync({ ...form, type: 'collaborateur' });
    handleCancel();
  };

  /* ── LIST ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Collaborateurs</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #3b82f6 100%)' }}>
            <Plus className="w-4 h-4" /> Nouveau Collaborateur
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un collaborateur..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun collaborateur trouvé" />
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 40%, #2563eb 70%, #3b82f6 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2"><Users2 className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouveau Collaborateur</h3>
              <p className="text-blue-100 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>
          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>

      {/* ── 1. Identité ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <SectionTitle>Informations — Identité</SectionTitle>

        {/* Matricule + Type pièce + N° pièce + Fin validité */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <F label="Matricule *" icon={Hash} color="#1d4ed8">
            <input type="text" name="matricule" value={form.matricule} onChange={hc} placeholder="Matricule" className={inp} />
          </F>
          <F label="Type pièce d'identité" icon={CreditCard} color="#7c3aed">
            <select name="typePiece" value={form.typePiece} onChange={hc} className={sel}>
              <option value="">— Type —</option>
              <option value="CIN">CIN</option>
              <option value="Passeport">Passeport</option>
              <option value="Carte séjour">Carte séjour</option>
              <option value="Autre">Autre</option>
            </select>
          </F>
          <F label="N° Pièce d'identité" icon={Hash} color="#7c3aed">
            <input type="text" name="numeroPiece" value={form.numeroPiece} onChange={hc} placeholder="Numéro" className={inp} />
          </F>
          <F label="Fin validité CIN" icon={Calendar} color="#dc2626">
            <input type="date" name="finValiditeCin" value={form.finValiditeCin} onChange={hc} className={inp} />
          </F>
        </div>

        {/* Prénom + Nom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Prénom *" icon={User} color="#2563eb">
            <input type="text" name="prenom" value={form.prenom} onChange={hc} placeholder="Prénom" className={inp} />
          </F>
          <F label="Nom *" icon={User} color="#1d4ed8">
            <input type="text" name="nom" value={form.nom} onChange={hc} placeholder="Nom de famille" className={inp} />
          </F>
        </div>

        {/* Naissance + Lieu + Ville */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <F label="Date de naissance" icon={Calendar} color="#0891b2">
            <input type="date" name="dateNaissance" value={form.dateNaissance} onChange={hc} className={inp} />
          </F>
          <F label="Lieu de naissance" icon={MapPin} color="#16a34a">
            <input type="text" name="lieuNaissance" value={form.lieuNaissance} onChange={hc} placeholder="Ville de naissance" className={inp} />
          </F>
          <F label="Ville" icon={MapPin} color="#0891b2">
            <input type="text" name="ville" value={form.ville} onChange={hc} placeholder="Ville de résidence" className={inp} />
          </F>
        </div>

        {/* Nationalité + Situation familiale + Nb enfants + Sexe */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <F label="Nationalité" icon={Flag} color="#d97706">
            <input type="text" name="nationalite" value={form.nationalite} onChange={hc} placeholder="Nationalité" className={inp} />
          </F>
          <F label="Situation familiale" icon={Users2} color="#7c3aed">
            <select name="situationFamiliale" value={form.situationFamiliale} onChange={hc} className={sel}>
              <option value="">— Situation —</option>
              <option value="Célibataire">Célibataire</option>
              <option value="Marié(e)">Marié(e)</option>
              <option value="Divorcé(e)">Divorcé(e)</option>
              <option value="Veuf/Veuve">Veuf/Veuve</option>
            </select>
          </F>
          <F label="Nombre d'enfants" icon={Users2} color="#64748b">
            <input type="number" name="nombreEnfants" value={form.nombreEnfants} onChange={hc} min="0" placeholder="0" className={inp} />
          </F>
          <F label="Sexe" icon={User} color="#64748b">
            <select name="sexe" value={form.sexe} onChange={hc} className={sel}>
              <option value="">— Sexe —</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
          </F>
        </div>

        {/* Code postal + Adresse */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <F label="Code postal" icon={Home} color="#0891b2">
            <input type="text" name="codePostal" value={form.codePostal} onChange={hc} placeholder="Code postal" className={inp} />
          </F>
          <div className="sm:col-span-3">
            <F label="Adresse" icon={MapPin} color="#64748b">
              <input type="text" name="adresse" value={form.adresse} onChange={hc} placeholder="Adresse complète" className={inp} />
            </F>
          </div>
        </div>
      </div>

      {/* ── 2. Situation collaborateur ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <SectionTitle>Situation collaborateur</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <F label="Direction *" icon={Building2} color="#1d4ed8">
            <input type="text" name="direction" value={form.direction} onChange={hc} placeholder="Direction / département" className={inp} />
          </F>
          <F label="Flotte" icon={Car} color="#0891b2">
            <input type="text" name="flotte" value={form.flotte} onChange={hc} placeholder="Flotte affectée" className={inp} />
          </F>
          <F label="Catégorie" icon={Tag} color="#d97706">
            <input type="text" name="categorie" value={form.categorie} onChange={hc} placeholder="Catégorie" className={inp} />
          </F>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Situation collaborateur" icon={Briefcase} color="#7c3aed">
            <select name="situationCollaborateur" value={form.situationCollaborateur} onChange={hc} className={sel}>
              <option value="">— Situation —</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="En congé">En congé</option>
              <option value="Suspendu">Suspendu</option>
              <option value="Retraité">Retraité</option>
              <option value="Démissionnaire">Démissionnaire</option>
              <option value="Licencié">Licencié</option>
            </select>
          </F>
          <F label="Situation CNSS" icon={Tag} color="#16a34a">
            <select name="situationCNSS" value={form.situationCNSS} onChange={hc} className={sel}>
              <option value="">— Situation CNSS —</option>
              <option value="Déclaré">Déclaré</option>
              <option value="Non déclaré">Non déclaré</option>
              <option value="Exonéré">Exonéré</option>
            </select>
          </F>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <F label="Date entrée" icon={Calendar} color="#16a34a">
            <input type="date" name="dateEntree" value={form.dateEntree} onChange={hc} className={inp} />
          </F>
          <F label="Date arrêt de travail" icon={Calendar} color="#dc2626">
            <input type="date" name="dateArretTravail" value={form.dateArretTravail} onChange={hc} className={inp} />
          </F>
          <F label="Motif de départ" icon={AlertCircle} color="#d97706">
            <input type="text" name="motifDepart" value={form.motifDepart} onChange={hc} placeholder="Motif de départ" className={inp} />
          </F>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <F label="N° CNSS" icon={Hash} color="#0891b2">
            <input type="text" name="cnss" value={form.cnss} onChange={hc} placeholder="N° CNSS" className={inp} />
          </F>
          <F label="N° CIMR" icon={Hash} color="#7c3aed">
            <input type="text" name="cimr" value={form.cimr} onChange={hc} placeholder="N° CIMR" className={inp} />
          </F>
          <F label="Date anticipée retraite" icon={Calendar} color="#64748b">
            <input type="date" name="dateAnticipeeRetraite" value={form.dateAnticipeeRetraite} onChange={hc} className={inp} />
          </F>
          <F label="Date début" icon={Calendar} color="#2563eb">
            <input type="date" name="dateDebut" value={form.dateDebut} onChange={hc} className={inp} />
          </F>
        </div>

        <F label="Compte comptable auxiliaire" icon={Landmark} color="#64748b">
          <input type="text" name="compteComptaireAux" value={form.compteComptaireAux} onChange={hc} placeholder="Compte comptable auxiliaire" className={inp} />
        </F>
      </div>

      {/* ── 3. Contact ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <SectionTitle>Contact</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Téléphone portable professionnel" icon={Phone} color="#1d4ed8">
            <input type="tel" name="telPortableProf" value={form.telPortableProf} onChange={hc} placeholder="+212 6xx xxx xxx" className={inp} />
          </F>
          <F label="Téléphone portable personnel" icon={Phone} color="#7c3aed">
            <input type="tel" name="telPortablePerso" value={form.telPortablePerso} onChange={hc} placeholder="+212 6xx xxx xxx" className={inp} />
          </F>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Téléphone fixe professionnel" icon={Phone} color="#0891b2">
            <input type="tel" name="telFixeProf" value={form.telFixeProf} onChange={hc} placeholder="+212 5xx xxx xxx" className={inp} />
          </F>
          <F label="Téléphone fixe personnel" icon={Phone} color="#64748b">
            <input type="tel" name="telFixePerso" value={form.telFixePerso} onChange={hc} placeholder="+212 5xx xxx xxx" className={inp} />
          </F>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Email professionnel" icon={Mail} color="#1d4ed8">
            <input type="email" name="emailProf" value={form.emailProf} onChange={hc} placeholder="email@entreprise.com" className={inp} />
          </F>
          <F label="Email personnel" icon={Mail} color="#7c3aed">
            <input type="email" name="emailPerso" value={form.emailPerso} onChange={hc} placeholder="email@personnel.com" className={inp} />
          </F>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-4">
          <p className="text-xs font-medium text-gray-500">Contacts en cas d'urgence</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Nom 1er contact" icon={User} color="#dc2626">
              <input type="text" name="nomContact1" value={form.nomContact1} onChange={hc} placeholder="Nom du contact" className={inp} />
            </F>
            <F label="Téléphone 1er contact" icon={Phone} color="#dc2626">
              <input type="tel" name="telContact1" value={form.telContact1} onChange={hc} placeholder="+212 6xx xxx xxx" className={inp} />
            </F>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Nom 2ème contact" icon={User} color="#d97706">
              <input type="text" name="nomContact2" value={form.nomContact2} onChange={hc} placeholder="Nom du contact" className={inp} />
            </F>
            <F label="Téléphone 2ème contact" icon={Phone} color="#d97706">
              <input type="tel" name="telContact2" value={form.telContact2} onChange={hc} placeholder="+212 6xx xxx xxx" className={inp} />
            </F>
          </div>
        </div>
      </div>

      {/* ── 4. Expériences ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <SectionTitle>Expériences</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Niveau d'études" icon={GraduationCap} color="#4f46e5">
            <select name="niveauEtudes" value={form.niveauEtudes} onChange={hc} className={sel}>
              <option value="">— Niveau —</option>
              <option value="Sans diplôme">Sans diplôme</option>
              <option value="Primaire">Primaire</option>
              <option value="Collège">Collège</option>
              <option value="Lycée / Bac">Lycée / Bac</option>
              <option value="Bac+2">Bac+2</option>
              <option value="Bac+3 / Licence">Bac+3 / Licence</option>
              <option value="Bac+5 / Master">Bac+5 / Master</option>
              <option value="Doctorat">Doctorat</option>
            </select>
          </F>
          <F label="Ancien employeur" icon={Building2} color="#64748b">
            <input type="text" name="ancienEmployeur" value={form.ancienEmployeur} onChange={hc} placeholder="Nom de l'ancien employeur" className={inp} />
          </F>
        </div>

        <F label="Expérience professionnelle" icon={Briefcase} color="#0891b2">
          <textarea name="experiencePro" value={form.experiencePro} onChange={hc} rows={3}
            placeholder="Décrivez l'expérience professionnelle..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
        </F>

        <F label="Formations et Diplômes" icon={GraduationCap} color="#7c3aed">
          <textarea name="formationsDiplomes" value={form.formationsDiplomes} onChange={hc} rows={3}
            placeholder="Formations suivies, diplômes obtenus..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
        </F>
      </div>

      {/* ── 5. Autres ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <SectionTitle>Autres</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <F label="Pointure de chaussures" icon={Ruler} color="#64748b">
            <input type="text" name="pointureChaussures" value={form.pointureChaussures} onChange={hc} placeholder="Ex: 42" className={inp} />
          </F>
          <F label="Taille" icon={Ruler} color="#64748b">
            <input type="text" name="taille" value={form.taille} onChange={hc} placeholder="Ex: M / 42" className={inp} />
          </F>
          <F label="Personnel de l'atelier" icon={Briefcase} color="#d97706">
            <select name="personnelAtelier" value={form.personnelAtelier} onChange={hc} className={sel}>
              <option value="">— Sélectionner —</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </F>
          <F label="Chauffeur" icon={Car} color="#0891b2">
            <select name="chauffeur" value={form.chauffeur} onChange={hc} className={sel}>
              <option value="">— Sélectionner —</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </F>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Nom de la banque" icon={Landmark} color="#1d4ed8">
            <input type="text" name="nomBanque" value={form.nomBanque} onChange={hc} placeholder="Nom de la banque" className={inp} />
          </F>
          <F label="N° de compte" icon={Hash} color="#7c3aed">
            <input type="text" name="numeroCompte" value={form.numeroCompte} onChange={hc} placeholder="RIB / N° de compte" className={inp} />
          </F>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.nom || !form.prenom || !form.matricule}
        >
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
