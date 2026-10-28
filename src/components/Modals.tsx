import { useState, useEffect, useRef } from 'react';
import { X, Church, Phone, Mail, User, Shield, Play, AlertTriangle, MapPin, Heart } from 'lucide-react';
import { UserProfile } from '../types';
import SafeImage from './SafeImage';
import { sanitizeText, sanitizeEmail, sanitizePhone, sanitizeCivilStatus } from '../utils/sanitize';

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onConfirmLogout: () => void;
  onShowToast: (message: string) => void;
}

export default function Modals({
  activeModal,
  onClose,
  user,
  onUpdateUser,
  onConfirmLogout,
  onShowToast,
}: ModalsProps) {
  // Form states for 'Os meus dados': Nome, Estado civil, contacto(Whatsapp), Morada, Email
  const [name, setName] = useState(user.name);
  const [civilStatus, setCivilStatus] = useState(user.civilStatus || 'Casado(a)');
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address || 'Rua do Sanatório, Morro Bento, Luanda');
  const [email, setEmail] = useState(user.email);
  const notifications = user.notificationsActive;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Form error states
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  }>({});

  // Sync state if user changes or modal opens
  useEffect(() => {
    if (activeModal === 'meus-dados') {
      setName(user.name);
      setCivilStatus(user.civilStatus || 'Casado(a)');
      setPhone(user.phone);
      setAddress(user.address || 'Rua do Sanatório, Morro Bento, Luanda');
      setEmail(user.email);
      setErrors({});
    }
  }, [user, activeModal]);

  useEffect(() => {
    if (!activeModal) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [activeModal]);

  if (!activeModal) return null;

  const handleSaveProfile = () => {
    const newErrors: { name?: string; phone?: string; email?: string; address?: string } = {};

    // 1. Sanitize & Validate Name
    const cleanName = sanitizeText(name, 60);
    if (!cleanName || cleanName.length < 2) {
      newErrors.name = 'O nome deve ter pelo menos 2 caracteres.';
    }

    // 2. Sanitize Civil Status
    const cleanCivilStatus = sanitizeCivilStatus(civilStatus);

    // 3. Sanitize & Validate Phone
    const phoneResult = sanitizePhone(phone);
    if (!phoneResult.isValid) {
      newErrors.phone = phoneResult.error || 'Número de contacto inválido.';
    }

    // 4. Sanitize Address
    const cleanAddress = sanitizeText(address, 120);
    if (!cleanAddress || cleanAddress.length < 3) {
      newErrors.address = 'Por favor, indique a sua morada.';
    }

    // 5. Sanitize & Validate Email
    const emailResult = sanitizeEmail(email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error || 'Email inválido.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      onShowToast(firstError || 'Por favor, corrija os erros no formulário.');
      return;
    }

    // Apply fully sanitized data
    onUpdateUser({
      name: cleanName,
      civilStatus: cleanCivilStatus,
      phone: phoneResult.value,
      address: cleanAddress,
      email: emailResult.value,
    });

    onShowToast('Dados do perfil actualizados nesta sessão.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E2E8F0] max-h-[90vh] overflow-y-auto flex flex-col p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <h2 id="modal-title" className="text-base font-bold text-slate-900">
            {activeModal === 'meus-dados' && 'Os meus dados'}
            {activeModal === 'minha-igreja' && 'Igreja'}
            {activeModal === 'actividades' && 'As minhas actividades'}
            {activeModal === 'notificacoes' && 'Notificações'}
            {activeModal === 'privacidade' && 'Privacidade e segurança'}
            {activeModal === 'ajuda' && 'Ajuda e suporte'}
            {activeModal === 'logout-confirm' && 'Terminar sessão'}
            {activeModal === 'sermoes' && 'Sermões Recentes'}
            {activeModal === 'biblia' && 'Palavra do Dia'}
          </h2>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Bodies */}
        <div className="py-4 space-y-4">
          {/* 1. Os meus dados: Nome, Estado civil, contacto(Whatsapp), Morada e Email */}
          {activeModal === 'meus-dados' && (
            <form noValidate className="space-y-3.5" onSubmit={(event) => { event.preventDefault(); handleSaveProfile(); }}>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-[#E2E8F0]">
                <SafeImage
                  src={user.avatar}
                  alt={user.name}
                  fallbackSrc="/assets/aistudio/Foto_de_Perfil__1__bd7124df.png"
                  fallbackType="avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{name || user.name}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">{user.status}</p>
                </div>
              </div>

              {/* 1. Nome */}
              <div>
                <label htmlFor="profile-name" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nome
                </label>
                <div
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs transition-colors ${
                    errors.name ? 'border-red-400 bg-red-50/20' : 'border-[#E2E8F0] focus-within:border-blue-500 focus-within:bg-white'
                  }`}
                >
                  <User className="w-4 h-4 text-[#0066cc] shrink-0" />
                  <input
                    type="text"
                    id="profile-name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "profile-name-error" : undefined}
                    value={name}
                    maxLength={60}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Seu nome completo"
                    className="w-full bg-transparent focus:outline-none text-slate-800 font-medium"
                  />
                </div>
                {errors.name && <p id="profile-name-error" role="alert" className="text-[10px] text-red-500 mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* 2. Estado civil */}
              <div>
                <label htmlFor="profile-civil-status" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Estado civil
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] focus-within:border-blue-500 focus-within:bg-white rounded-xl text-xs transition-colors">
                  <Heart className="w-4 h-4 text-[#0066cc] shrink-0" />
                  <select
                    id="profile-civil-status"
                    value={civilStatus}
                    onChange={(e) => setCivilStatus(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                </div>
              </div>

              {/* 3. contacto(Whatsapp) */}
              <div>
                <label htmlFor="profile-phone" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  contacto(Whatsapp)
                </label>
                <div
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs transition-colors ${
                    errors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#E2E8F0] focus-within:border-blue-500 focus-within:bg-white'
                  }`}
                >
                  <Phone className="w-4 h-4 text-[#0066cc] shrink-0" />
                  <input
                    type="tel"
                    id="profile-phone"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "profile-phone-error" : undefined}
                    value={phone}
                    maxLength={25}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+244 9..."
                    className="w-full bg-transparent focus:outline-none text-slate-800 font-medium"
                  />
                </div>
                {errors.phone && <p id="profile-phone-error" role="alert" className="text-[10px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
              </div>

              {/* 4. Morada */}
              <div>
                <label htmlFor="profile-address" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Morada
                </label>
                <div
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs transition-colors ${
                    errors.address ? 'border-red-400 bg-red-50/20' : 'border-[#E2E8F0] focus-within:border-blue-500 focus-within:bg-white'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#0066cc] shrink-0" />
                  <input
                    type="text"
                    id="profile-address"
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? "profile-address-error" : undefined}
                    value={address}
                    maxLength={120}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    placeholder="Bairro, Rua, Província"
                    className="w-full bg-transparent focus:outline-none text-slate-800 font-medium"
                  />
                </div>
                {errors.address && <p id="profile-address-error" role="alert" className="text-[10px] text-red-500 mt-1 font-medium">{errors.address}</p>}
              </div>

              {/* 5. Email */}
              <div>
                <label htmlFor="profile-email" className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Email
                </label>
                <div
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs transition-colors ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#E2E8F0] focus-within:border-blue-500 focus-within:bg-white'
                  }`}
                >
                  <Mail className="w-4 h-4 text-[#0066cc] shrink-0" />
                  <input
                    type="email"
                    id="profile-email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "profile-email-error" : undefined}
                    value={email}
                    maxLength={80}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="exemplo@email.com"
                    className="w-full bg-transparent focus:outline-none text-slate-800 font-medium"
                  />
                </div>
                {errors.email && <p id="profile-email-error" role="alert" className="text-[10px] text-red-500 mt-1 font-medium">{errors.email}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0066cc] hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer mt-2"
              >
                Salvar Alterações
              </button>
            </form>
          )}

          {/* 2. Igreja */}
          {activeModal === 'minha-igreja' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
                  <Church className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">IGREJA MEVD</h4>
                  <p className="text-slate-600 text-[11px]">Sede Principal • Luanda, Angola</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-[#E2E8F0]">
                <p className="text-slate-700 font-semibold text-[11px]">Horários de Cultos:</p>
                <ul className="text-slate-600 space-y-1 text-[11px]">
                  <li>• Domingo: 09:00 - Culto de Adoração & Ensino</li>
                  <li>• Quarta-feira: 18:30 - Culto de Doutrina e Oração</li>
                  <li>• Sábado: 16:00 - Reunião de Jovens e Adolescentes</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-[#E2E8F0]">
                <p className="text-slate-700 font-semibold text-[11px]">Pastorado Sénior:</p>
                <p className="text-slate-600 text-[11px] mt-0.5">Pr. Feliz Paulo</p>
              </div>
            </div>
          )}

          {/* 3. As minhas actividades */}
          {activeModal === 'actividades' && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Exemplos de eventos (3)</h4>
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-slate-800">Congresso de Jovens 2027</p>
                      <p className="text-[10px] text-slate-500">15 Mai • Luanda, Angola</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Confirmado
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-slate-800">Vigília de Oração</p>
                      <p className="text-[10px] text-slate-500">28 Jun • Sede da Igreja</p>
                    </div>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                      Pendente
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-slate-800">Retiro Espiritual</p>
                      <p className="text-[10px] text-slate-500">12 Jul • Província de Talatona</p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      Em breve
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Departamentos (2)</h4>
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <p className="font-semibold text-xs text-slate-800">Ministério de Louvor</p>
                    <span className="text-[10px] font-medium text-slate-500">Vocal</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <p className="font-semibold text-xs text-slate-800">Departamento Jovem</p>
                    <span className="text-[10px] font-medium text-slate-500">Comissão de Apoio</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Notificações */}
          {activeModal === 'notificacoes' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Alertas de Eventos e Cultos</h4>
                  <p className="text-[11px] text-slate-500">Lembretes 24h antes das actividades</p>
                </div>
                <button
                  onClick={() => {
                    onUpdateUser({ notificationsActive: !notifications });
                    onShowToast(!notifications ? 'Preferência de notificações activada nesta sessão.' : 'Preferência de notificações desactivada nesta sessão.');
                  }}
                  role="switch"
                  aria-label="Alertas de Eventos e Cultos"
                  aria-checked={notifications}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    notifications ? 'bg-[#0066cc]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl text-[11px] leading-relaxed">
                Esta opção é demonstrativa e a alteração dura apenas nesta sessão. O envio automático de alertas não está configurado.
              </div>
            </div>
          )}

          {/* 5. Privacidade e Segurança */}
          {activeModal === 'privacidade' && (
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Protecção de Dados Pessoais</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Os dados de perfil são demonstrativos e as alterações ficam apenas nesta sessão. Esta versão não implementa autenticação nem encriptação de ponta a ponta.
                  </p>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed">
                Evite introduzir dados sensíveis nesta versão de demonstração.
              </p>
            </div>
          )}

          {/* 6. Ajuda e suporte */}
          {activeModal === 'ajuda' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 text-[11px]">
                Precisa de apoio espiritual, informações ou esclarecimento de dúvidas? Fale connosco:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-xs">Secretaria Geral</span>
                  <span className="text-blue-600 font-semibold text-xs">+244 923 000 111</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-xs">Linha de Oração e Aconselhamento</span>
                  <span className="text-blue-600 font-semibold text-xs">+244 912 333 444</span>
                </div>
              </div>
            </div>
          )}

          {/* 7. Sermões */}
          {activeModal === 'sermoes' && (
            <div className="space-y-2.5 text-xs">
              <button
                type="button"
                onClick={() => onShowToast('Áudio do sermão indisponível nesta versão.')}
                className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-100 flex items-center gap-3 cursor-pointer transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center pl-0.5 shrink-0 group-hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                    Vencendo Gigantes pela Fé
                  </h4>
                  <p className="text-[10px] text-slate-500">Pr. Feliz Paulo • 42 min</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Áudio do sermão indisponível nesta versão.')}
                className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-100 flex items-center gap-3 cursor-pointer transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center pl-0.5 shrink-0 group-hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                    O Poder da Oração em Unidade
                  </h4>
                  <p className="text-[10px] text-slate-500">Pra. Manuela Paulo • 38 min</p>
                </div>
              </button>
            </div>
          )}

          {/* 8. Bíblia */}
          {activeModal === 'biblia' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/60">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Versículo do Dia • Filipenses 4:13
                </span>
                <blockquote className="text-slate-800 italic font-medium text-xs leading-relaxed">
                  "Tudo posso naquele que me fortalece."
                </blockquote>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Leia o plano bíblico anual da IGREJA MEVD e fortaleça a sua fé diariamente.
              </p>
            </div>
          )}

          {/* 9. Confirm Logout */}
          {activeModal === 'logout-confirm' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-700">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <p className="text-xs leading-relaxed font-medium">
                  Tem a certeza de que deseja terminar a sessão de membro em <strong>IGREJA MEVD</strong>?
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onConfirmLogout();
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Terminar Sessão
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
