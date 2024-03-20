import { IncomingWebhook } from "@slack/webhook";

const url = "https://hooks.slack.com/services/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";

export const slack = new IncomingWebhook(url);