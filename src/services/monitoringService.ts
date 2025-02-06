import prometheus from 'prom-client';

export class MonitoringService {
  private static instance: MonitoringService;
  
  // Metrics
  private readonly authRequestCounter: prometheus.Counter;
  private readonly tokenIssueCounter: prometheus.Counter;
  private readonly errorCounter: prometheus.Counter;
  private readonly requestDuration: prometheus.Histogram;

  private constructor() {
    prometheus.collectDefaultMetrics();

    this.authRequestCounter = new prometheus.Counter({
      name: 'oauth_auth_requests_total',
      help: 'Total number of authorization requests'
    });

    this.tokenIssueCounter = new prometheus.Counter({
      name: 'oauth_token_issues_total',
      help: 'Total number of tokens issued'
    });

    this.errorCounter = new prometheus.Counter({
      name: 'oauth_errors_total',
      help: 'Total number of OAuth errors'
    });

    this.requestDuration = new prometheus.Histogram({
      name: 'oauth_request_duration_seconds',
      help: 'OAuth request duration in seconds',
      buckets: [0.1, 0.5, 1, 2, 5]
    });
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  recordAuthRequest() {
    this.authRequestCounter.inc();
  }

  recordTokenIssue() {
    this.tokenIssueCounter.inc();
  }

  recordError() {
    this.errorCounter.inc();
  }

  measureRequestDuration(duration: number) {
    this.requestDuration.observe(duration);
  }
}

export const monitoringMiddleware = (req: any, res: { on: (arg0: string, arg1: () => void) => void; statusCode: number; }, next: () => void) => {
  const monitoring = MonitoringService.getInstance();
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    monitoring.measureRequestDuration(duration);

    if (res.statusCode >= 400) {
      monitoring.recordError();
    }
  });

  next();
};