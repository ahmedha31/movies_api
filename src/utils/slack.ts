import { IncomingWebhook } from "@slack/webhook";

const url = "https://hooks.slack.com/services/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";

export const slack = new IncomingWebhook(url);