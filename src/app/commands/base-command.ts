export interface BaseCommand {
  execute(): void;
  getDescription(): string;
}
