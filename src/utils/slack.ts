import { IncomingWebhook } from "@slack/webhook";

const url = "https://hooks.slack.com/services/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";

export const slack = new IncomingWebhook(url);