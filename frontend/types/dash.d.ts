 interface SummaryData {
  Total?: {
    achieved?: number;
    target?: number;
    percent?: number;
  };
  Balance?: number;
  RequiredRate?: number;
  CurrentAvg?: number;
  Renewal?: {
    target?: number;
    achieved?: number;
    percent?: number;
  };
  Acquisition?: {
    target?: number;
    achieved?: number;
    percent?: number;
  };
}

 interface SummaryResponse {
  success: boolean;
  data: SummaryData;
}
