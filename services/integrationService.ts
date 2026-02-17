
import { 
  IntegrationConfig, 
  BaseApiPayload, 
  SmsPayload, 
  WhatsAppPayload, 
  EmailPayload, 
  VoiceCallPayload, 
  AnalyticsEventPayload,
  IntegrationEnvironment 
} from '../types';

// --- INITIAL DEFAULT CONFIGURATION ---
const DEFAULT_CONFIGS: IntegrationConfig[] = [
  { id: 'sms_1', type: 'sms', provider: 'twilio', apiKey: '', enabled: false, environment: 'sandbox' },
  { id: 'wa_1', type: 'whatsapp', provider: 'meta', apiKey: '', enabled: false, environment: 'sandbox' },
  { id: 'email_1', type: 'email', provider: 'sendgrid', apiKey: '', enabled: false, environment: 'sandbox' },
  { id: 'voice_1', type: 'voice', provider: 'elevenlabs', apiKey: '', enabled: true, environment: 'production', options: { agentId: 'agent_6801kgqxsbrmf7y9ycydz31tcwm0' } },
  { id: 'maps_1', type: 'maps', provider: 'google_maps', apiKey: '', enabled: false, environment: 'sandbox' },
  { id: 'analytics_1', type: 'analytics', provider: 'ga4', apiKey: '', enabled: true, environment: 'production' },
  { id: 'storage_1', type: 'storage', provider: 'aws_s3', apiKey: '', enabled: false, environment: 'sandbox' },
  { id: 'ai_1', type: 'ai', provider: 'openai', apiKey: '', enabled: false, environment: 'sandbox' },
];

class IntegrationService {
  private configs: IntegrationConfig[];
  private auditLog: any[] = [];

  constructor() {
    const saved = localStorage.getItem('zii_integrations');
    this.configs = saved ? JSON.parse(saved) : DEFAULT_CONFIGS;
  }

  // --- CONFIGURATION MANAGEMENT ---

  getConfigs(): IntegrationConfig[] {
    return this.configs;
  }

  updateConfig(id: string, updates: Partial<IntegrationConfig>) {
    this.configs = this.configs.map(c => c.id === id ? { ...c, ...updates } : c);
    localStorage.setItem('zii_integrations', JSON.stringify(this.configs));
    this.logSystemEvent('config_update', { config_id: id, updates });
  }

  getConfig(type: string): IntegrationConfig | undefined {
    return this.configs.find(c => c.type === type && c.enabled);
  }

  // --- CORE EVENT HANDLER ---

  private async dispatchEvent<T>(type: string, payload: T, eventType: string): Promise<boolean> {
    const config = this.getConfig(type);
    
    // Log the attempt
    this.logSystemEvent(`${type}.attempt`, { eventType, hasConfig: !!config });

    if (!config) {
      console.warn(`[ZII-INTEGRATION] No enabled configuration for ${type}. Event: ${eventType} suppressed.`);
      return false;
    }

    const envelope: BaseApiPayload = {
      schema_version: '1.0.0',
      environment: config.environment,
      request_id: crypto.randomUUID(),
      timestamp_utc: new Date().toISOString(),
      source_system: 'ZII_WEB',
      event_type: eventType,
      payload: payload
    };

    console.log(`[ZII-API-OUTBOUND] ${config.provider.toUpperCase()} (${config.environment})`, envelope);

    // SIMULATE NETWORK LATENCY
    await new Promise(resolve => setTimeout(resolve, 800));

    // SIMULATE SUCCESS
    this.logSystemEvent(`${type}.success`, { request_id: envelope.request_id, provider: config.provider });
    return true;
  }

  // --- PUBLIC API METHODS ---

  async sendSMS(payload: Omit<SmsPayload, 'provider' | 'language'>): Promise<boolean> {
    const config = this.getConfig('sms');
    const fullPayload: SmsPayload = {
      ...payload,
      provider: (config?.provider as any) || 'twilio',
      language: 'en'
    };
    return this.dispatchEvent('sms', fullPayload, 'sms.send');
  }

  async sendWhatsApp(payload: Omit<WhatsAppPayload, 'provider'>): Promise<boolean> {
    const config = this.getConfig('whatsapp');
    const fullPayload: WhatsAppPayload = {
      ...payload,
      provider: (config?.provider as any) || 'meta'
    };
    return this.dispatchEvent('whatsapp', fullPayload, 'whatsapp.send');
  }

  async sendEmail(payload: Omit<EmailPayload, 'provider'>): Promise<boolean> {
    const config = this.getConfig('email');
    const fullPayload: EmailPayload = {
      ...payload,
      provider: (config?.provider as any) || 'sendgrid'
    };
    return this.dispatchEvent('email', fullPayload, 'email.send');
  }

  async triggerVoiceCall(payload: Omit<VoiceCallPayload, 'provider'>): Promise<boolean> {
    const config = this.getConfig('voice');
    const fullPayload: VoiceCallPayload = {
      ...payload,
      provider: (config?.provider as any) || 'elevenlabs'
    };
    return this.dispatchEvent('voice', fullPayload, 'call.outbound');
  }

  async trackAnalytics(payload: AnalyticsEventPayload): Promise<void> {
    // Analytics is fire-and-forget
    this.dispatchEvent('analytics', payload, 'analytics.event');
  }

  // --- AUDIT LOGGING ---

  private logSystemEvent(event: string, meta: any) {
    const entry = {
      timestamp: new Date().toISOString(),
      event,
      meta,
      id: crypto.randomUUID()
    };
    this.auditLog.unshift(entry);
    // Keep log size manageable
    if (this.auditLog.length > 100) this.auditLog.pop();
  }

  getAuditLog() {
    return this.auditLog;
  }

  async testConnection(type: string): Promise<{ success: boolean; message: string }> {
    const config = this.getConfig(type);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!config) return { success: false, message: 'No enabled configuration found.' };
    if (!config.apiKey) return { success: false, message: 'API Key is missing.' };
    
    return { success: true, message: `Successfully connected to ${config.provider} [${config.environment}]` };
  }
}

export const integrationService = new IntegrationService();
