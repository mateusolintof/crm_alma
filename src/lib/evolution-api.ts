/**
 * Evolution API Integration Helper
 *
 * Documentation: https://doc.evolution-api.com/
 *
 * This helper provides methods to interact with Evolution API for WhatsApp messaging.
 * Evolution API is a third-party WhatsApp integration that doesn't use Meta's official API.
 */

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME;

if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !INSTANCE_NAME) {
    console.warn('Evolution API credentials not configured. WhatsApp messaging will not work.');
}

interface SendTextMessageParams {
    number: string; // Phone number in format: 5511999999999
    text: string;
}

interface SendMediaMessageParams {
    number: string;
    mediaUrl: string;
    caption?: string;
    mediaType?: 'image' | 'video' | 'document' | 'audio';
}

interface EvolutionAPIResponse {
    key: {
        remoteJid: string;
        fromMe: boolean;
        id: string;
    };
    message: any;
    messageTimestamp: number;
    status: string;
}

/**
 * Send text message via WhatsApp
 */
export async function sendWhatsAppTextMessage(params: SendTextMessageParams): Promise<EvolutionAPIResponse> {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !INSTANCE_NAME) {
        throw new Error('Evolution API not configured');
    }

    const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
            number: params.number,
            text: params.text,
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Evolution API error: ${error}`);
    }

    return response.json();
}

/**
 * Send media message (image, video, document) via WhatsApp
 */
export async function sendWhatsAppMediaMessage(params: SendMediaMessageParams): Promise<EvolutionAPIResponse> {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !INSTANCE_NAME) {
        throw new Error('Evolution API not configured');
    }

    const endpoint = params.mediaType === 'image'
        ? 'sendMedia'
        : params.mediaType === 'video'
        ? 'sendMedia'
        : 'sendMedia';

    const response = await fetch(`${EVOLUTION_API_URL}/message/${endpoint}/${INSTANCE_NAME}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
            number: params.number,
            mediaUrl: params.mediaUrl,
            caption: params.caption,
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Evolution API error: ${error}`);
    }

    return response.json();
}

/**
 * Get instance connection status
 */
export async function getInstanceStatus(): Promise<{
    state: 'open' | 'close' | 'connecting';
    statusCode?: number;
}> {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !INSTANCE_NAME) {
        throw new Error('Evolution API not configured');
    }

    const response = await fetch(`${EVOLUTION_API_URL}/instance/connectionState/${INSTANCE_NAME}`, {
        headers: {
            'apikey': EVOLUTION_API_KEY,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get instance status');
    }

    return response.json();
}

/**
 * Format phone number for Evolution API (removes special characters)
 * Example: +55 (11) 99999-9999 -> 5511999999999
 */
export function formatPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
}
