export default interface DatabaseResponseInterface {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId?: string;
}
