import { IncomingWebhook } from "@slack/webhook";

const url = "https://hooks.slack.com/services/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";

export const slack = new IncomingWebhook(url);