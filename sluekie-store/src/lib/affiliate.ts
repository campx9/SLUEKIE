import Cookies from 'js-cookie';
import { supabase } from './supabase';
import { BRAND_CONFIG } from '../config/brand';

const AFFILIATE_COOKIE = 'sluekie_affiliate';
const AFFILIATE_EXPIRY_DAYS = 30;

export interface AffiliateData {
  code: string;
  timestamp: number;
}

export function trackAffiliateClick(code: string): void {
  const affiliateData: AffiliateData = {
    code,
    timestamp: Date.now(),
  };

  Cookies.set(AFFILIATE_COOKIE, JSON.stringify(affiliateData), {
    expires: AFFILIATE_EXPIRY_DAYS,
    sameSite: 'lax',
  });

  recordAffiliateClick(code);
}

export function getAffiliateCode(): string | null {
  const cookie = Cookies.get(AFFILIATE_COOKIE);

  if (!cookie) return null;

  try {
    const data: AffiliateData = JSON.parse(cookie);
    const daysSinceClick = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);

    if (daysSinceClick > AFFILIATE_EXPIRY_DAYS) {
      Cookies.remove(AFFILIATE_COOKIE);
      return null;
    }

    return data.code;
  } catch {
    return null;
  }
}

async function recordAffiliateClick(code: string): Promise<void> {
  try {
    const sessionId = getOrCreateSessionId();

    await supabase.from('affiliate_clicks').insert({
      brand_id: BRAND_CONFIG.brand_id,
      affiliate_code: code,
      session_id: sessionId,
      ip_address: null,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  } catch (error) {
    console.error('Failed to record affiliate click:', error);
  }
}

export async function markAffiliateConversion(orderId: string): Promise<void> {
  const affiliateCode = getAffiliateCode();

  if (!affiliateCode) return;

  try {
    const sessionId = getOrCreateSessionId();

    await supabase
      .from('affiliate_clicks')
      .update({
        converted: true,
        order_id: orderId,
      })
      .eq('affiliate_code', affiliateCode)
      .eq('session_id', sessionId)
      .eq('converted', false);
  } catch (error) {
    console.error('Failed to mark affiliate conversion:', error);
  }
}

function getOrCreateSessionId(): string {
  const SESSION_COOKIE = 'sluekie_session';
  let sessionId = Cookies.get(SESSION_COOKIE);

  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    Cookies.set(SESSION_COOKIE, sessionId, {
      expires: 365,
      sameSite: 'lax',
    });
  }

  return sessionId;
}

export function initializeAffiliateTracking(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref') || urlParams.get('affiliate');

  if (refCode) {
    trackAffiliateClick(refCode);
  }
}
