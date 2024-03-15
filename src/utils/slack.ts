import { IncomingWebhook } from "@slack/webhook";

const url = "https://hooks.slack.com/services/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";

export const slack = new IncomingWebhook(url);