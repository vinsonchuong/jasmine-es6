export default async function catchError(promise) {
  try {
    await promise;
  } catch (e) {
    return e.message || e;
  }
}
