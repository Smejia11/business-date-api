export abstract class IBusinessDateService {
  abstract calculate(
    days?: number,
    hours?: number,
    dateUtc?: string,
  ): Promise<string>;
}
