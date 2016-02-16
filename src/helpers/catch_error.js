export default async function catchError(promise) {
  try {
    await promise;
    return null;
  } catch (error) {
    return error.message || error;
  }
}
