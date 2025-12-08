'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/authcontext';
import { useRouter } from 'next/navigation';

const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const SettingsIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 0-.69 2.15l.1.53a2 2 0 0 1-.79 2.45l-.46.33a2 2 0 0 0-.25 2.5l.3.56a2 2 0 0 1-.39 2.46l-.3.35a2 2 0 0 0-.1 2.7l.62 1.35a2 2 0 0 0 2.21 1.05l.41-.12a2 2 0 0 1 2.44 1.25l.4.92a2 2 0 0 0 1.93 1.34h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 0 .69-2.15l-.1-.53a2 2 0 0 1 .79-2.45l.46-.33a2 2 0 0 0 .25-2.5l-.3-.56a2 2 0 0 1 .39-2.46l.3-.35a2 2 0 0 0 .1-2.7l-.62-1.35a2 2 0 0 0-2.21-1.05l-.41.12a2 2 0 0 1-2.44-1.25l-.4-.92A2 2 0 0 0 12.22 2z"/><circle cx="12" cy="12" r="3"/></svg>;
const MailIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.83 1.83 0 0 1-2.06 0L2 7"/></svg>;
const LockIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const BellIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.37 21a2 2 0 0 0 3.26 0"/></svg>;
const PhoneIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;



const InputField = ({ label, id, type = 'text', value, onChange, disabled = false, icon: Icon, placeholder = "" }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium text-foreground/80 flex items-center">
            {Icon && <Icon className="w-4 h-4 mr-2 text-primary" />}
            {label}
        </label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border rounded-lg text-foreground bg-input transition-colors focus:ring-2 focus:ring-ring focus:border-primary/50 ${disabled ? 'bg-muted/50 cursor-not-allowed border-border' : 'border-input hover:border-primary/50'}`}
        />
    </div>
);

const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
        <span className="text-foreground/90 font-medium">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                checked={checked} 
                onChange={onChange} 
                className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
    </div>
);



const ProfileForm = ({ setActiveTab, authUser }) => {
    const [formData, setFormData] = useState({
        name: authUser?.name || '',
        email: authUser?.email || '',
        phone: authUser?.phone || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // TODO: Integrar com API de atualização de perfil
        console.log('Atualizando perfil:', formData);
        
        setIsEditing(false);
        setStatusMessage('Perfil atualizado com sucesso!');
        
        setTimeout(() => setStatusMessage(''), 3000); 
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-white text-3xl font-bold border-4 border-primary/20 shadow-md">
                    {getInitials(authUser?.name)}
                </div>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                    {authUser?.user_type === 'admin' ? 'Administrador' : authUser?.user_type === 'editor' ? 'Editor' : 'Usuário'}
                </p>
            </div>

            <InputField
                label="Nome Completo"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={UserIcon}
                placeholder="Seu nome completo"
            />
            
            <InputField
                label="E-mail (Não Editável)"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
                icon={MailIcon}
            />

            <InputField
                label="Telefone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={PhoneIcon} 
                placeholder="(xx) xxxxx-xxxx"
            />

            {/* Link para Configurações - Visível no Perfil */}
            <div className="text-right pt-2">
                <button type="button" onClick={() => setActiveTab('settings')}
                    className="text-sm font-medium text-secondary hover:text-secondary-foreground transition underline">
                    Acessar Configurações e Segurança &rarr;
                </button>
            </div>


            {statusMessage && (
                <p className={`text-sm font-medium ${statusMessage.includes('sucesso') ? 'text-green-600' : 'text-destructive'} transition-opacity duration-300`}>
                    {statusMessage}
                </p>
            )}

            <div className="flex justify-end space-x-4 pt-4">
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: authUser?.name || '',
                                    email: authUser?.email || '',
                                    phone: authUser?.phone || '',
                                }); 
                                setStatusMessage('Edição cancelada.');
                                setTimeout(() => setStatusMessage(''), 2000);
                            }}
                            className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition shadow-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 transition"
                        >
                            Salvar Alterações
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 transition"
                    >
                        Editar Perfil
                    </button>
                )}
            </div>

            {/* Info do ID do Usuário */}
            <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                    ID do Usuário: <span className="font-mono">{authUser?.id}</span>
                </p>
            </div>
        </form>
    );
};


const SettingsForm = () => {
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
    const [notifications, setNotifications] = useState({ email: true, push: false, news: true });
    const [statusMessage, setStatusMessage] = useState('');
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        
        if (password.new !== password.confirm) {
            setStatusMessage('Erro: A nova senha e a confirmação não coincidem.');
            return;
        }
        

        console.log('Alterando senha. Senha Nova:', password.new);
        
        setStatusMessage('Senha alterada com sucesso!');
        setPassword({ current: '', new: '', confirm: '' });
        setTimeout(() => setStatusMessage(''), 4000);
    };

    const handleNotificationToggle = (key) => {
        const newState = { ...notifications, [key]: !notifications[key] };
        setNotifications(newState);
        console.log(`Notificação ${key} alterada para: ${newState[key]}`);
        setStatusMessage('Preferências salvas.');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    return (
        <div className="space-y-10">
            
            {/* Seção de Alteração de Senha */}
            <div className="space-y-4 border border-border p-6 rounded-xl bg-card/70">
                <h3 className="text-xl font-semibold text-foreground flex items-center border-b pb-2 border-border/50">
                    <LockIcon className="w-5 h-5 mr-3 text-primary" /> Alterar Senha
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <InputField
                        label="Senha Atual"
                        id="currentPassword"
                        type="password"
                        value={password.current}
                        onChange={(e) => setPassword(p => ({ ...p, current: e.target.value }))}
                        placeholder="Sua senha atual"
                        required
                    />
                    <InputField
                        label="Nova Senha"
                        id="newPassword"
                        type="password"
                        value={password.new}
                        onChange={(e) => setPassword(p => ({ ...p, new: e.target.value }))}
                        placeholder="Mínimo 8 caracteres"
                        required
                    />
                    <InputField
                        label="Confirme Nova Senha"
                        id="confirmPassword"
                        type="password"
                        value={password.confirm}
                        onChange={(e) => setPassword(p => ({ ...p, confirm: e.target.value }))}
                        placeholder="Confirme a nova senha"
                        required
                    />
                    
                    {statusMessage && (
                        <p className={`text-sm font-medium ${statusMessage.includes('sucesso') ? 'text-green-600' : 'text-destructive'} transition-opacity duration-300`}>
                            {statusMessage}
                        </p>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 transition"
                        >
                            Alterar Senha
                        </button>
                    </div>
                </form>
            </div>

            {/* Seção de Preferências de Notificação */}
            <div className="space-y-4 border border-border p-6 rounded-xl bg-card/70">
                <h3 className="text-xl font-semibold text-foreground flex items-center border-b pb-2 border-border/50">
                    <BellIcon className="w-5 h-5 mr-3 text-primary" /> Preferências de Notificação
                </h3>
                <div className="divide-y divide-border/50">
                    <ToggleSwitch
                        label="Receber notificações por E-mail"
                        checked={notifications.email}
                        onChange={() => handleNotificationToggle('email')}
                    />
                    <ToggleSwitch
                        label="Ativar notificações Push (App/Web)"
                        checked={notifications.push}
                        onChange={() => handleNotificationToggle('push')}
                    />
                    <ToggleSwitch
                        label="Receber newsletters e ofertas especiais"
                        checked={notifications.news}
                        onChange={() => handleNotificationToggle('news')}
                    />
                </div>
                <p id="notifications-status" className="text-sm font-medium text-green-600 transition-opacity duration-300 hidden"></p>
            </div>

            {/* Simulação de Opção de Deletar Conta */}
            <div className="border border-destructive/50 p-6 rounded-xl bg-destructive/10">
                <h3 className="text-xl font-semibold text-destructive mb-2">Zona de Perigo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    A exclusão da conta é permanente e não pode ser desfeita.
                </p>
                <button 
                    type="button" 
                    onClick={() => console.log("Simulando exclusão de conta")}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg shadow-md hover:bg-destructive/90 transition text-sm font-medium"
                >
                    Excluir Minha Conta
                </button>
            </div>

        </div>
    );
};



export default function MeuPerfilConfiguracaoPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/signin');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileForm setActiveTab={setActiveTab} authUser={user} />;
            case 'settings':
                return <SettingsForm />;
            default:
                return <ProfileForm setActiveTab={setActiveTab} authUser={user} />;
        }
    };

    const TabButton = ({ name, icon: Icon, label }) => {
        const isActive = activeTab === name;
        const baseClass = "flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors cursor-pointer";
        const activeClass = "bg-primary text-primary-foreground shadow-md";
        const inactiveClass = "text-muted-foreground hover:bg-muted/50 hover:text-foreground";
        
        return (
            <button
                onClick={() => setActiveTab(name)}
                className={`${baseClass} ${isActive ? activeClass : inactiveClass} w-full text-left`}
            >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 pt-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                
                {/* Cabeçalho */}
                <header className="mb-8 border-b border-border pb-4">
                    <h1 className="text-4xl font-bold text-foreground">Olá, {user.name}!</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie suas informações pessoais e preferências de conta.
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Navegação Lateral (Sidebar) */}
                    <nav className="w-full lg:w-1/4 bg-card p-4 rounded-xl shadow-lg h-fit border border-border">
                        <div className="space-y-2">
                            <TabButton name="profile" icon={UserIcon} label="Meu Perfil" />
                            {/* O link para a página de configurações é simulado pela troca de aba.
                                Se fosse uma página separada (ex: /configuracoes), usaríamos Link do Next:
                                <Link href="/configuracoes" className="link-style">Configurações</Link>
                                Mas como o requisito é manter tudo na mesma tela com navegação interna, usamos a troca de estado.
                            */}
                            <TabButton name="settings" icon={SettingsIcon} label="Configurações e Segurança" />
                        </div>
                    </nav>

                    {/* Conteúdo da Aba Ativa */}
                    <main className="w-full lg:w-3/4 bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border transition-all duration-300">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}