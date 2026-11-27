export type TranscriptionInput = {
  provider: "browser";
  transcript: string;
};

export type Transcription = {
  provider: TranscriptionInput["provider"];
  text: string;
};

export interface Transcriber {
  transcribe(input: TranscriptionInput): Promise<Transcription>;
}
