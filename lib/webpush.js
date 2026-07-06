import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_MAILTO || 'mailto:synchronous.build.digital@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Send a push notification to a user's subscriptions.
 * @param {Array} subscriptions - Array of push subscription objects from User.pushSubscriptions
 * @param {Object} payload - { title, body, url, tag, icon }
 */
export async function sendPushToUser(subscriptions = [], payload = {}) {
  if (!subscriptions || subscriptions.length === 0) return;

  const data = JSON.stringify({
    title: payload.title || 'Synchronous Build Digital',
    body: payload.body || 'You have a new notification.',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: payload.tag || `sync-push-${Date.now()}`,
    url: payload.url || '/',
  });

  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(sub, data).catch(err => {
        // 410 Gone = subscription expired/unsubscribed, can be cleaned up
        if (err.statusCode === 410) {
          return { expired: true, endpoint: sub.endpoint };
        }
        throw err;
      })
    )
  );

  return results;
}

/**
 * Send a push notification to the admin (role === 'admin') — finds all admin subscriptions.
 */
export async function sendPushToAdmins(User, payload) {
  try {
    const admins = await User.find({ role: 'admin', 'pushSubscriptions.0': { $exists: true } }).select('pushSubscriptions');
    for (const admin of admins) {
      await sendPushToUser(admin.pushSubscriptions, payload);
    }
  } catch (e) {
    console.error('[WebPush] Failed to push to admins:', e.message);
  }
}

/**
 * Send a push notification to a specific user by their User document.
 */
export async function sendPushToOneUser(userDoc, payload) {
  try {
    if (userDoc?.pushSubscriptions?.length > 0) {
      await sendPushToUser(userDoc.pushSubscriptions, payload);
    }
  } catch (e) {
    console.error('[WebPush] Failed to push to user:', e.message);
  }
}
