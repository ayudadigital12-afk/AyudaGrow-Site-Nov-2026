// Order assertions use logical names; the artifact suite verifies actual hashed files.
export const normaliseAssetNames=html=>html.replace(/\.[a-f0-9]{12}(?=\.(?:js|css)(?:[?"']))/g,'');
