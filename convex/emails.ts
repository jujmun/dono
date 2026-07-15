"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { sendTransactionalEmail } from "./lib/emails";

export const sendCampaignApproved = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    campaignTitle: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.email,
      subject: `Your campaign "${args.campaignTitle}" is live`,
      text: [
        `Hi ${args.name},`,
        "",
        `Great news — your campaign "${args.campaignTitle}" has been approved and is now live on Dono.`,
        "",
        "Sign in to share it with your community.",
      ].join("\n"),
    });
  },
});

export const sendCampaignRejected = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    campaignTitle: v.string(),
    reason: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.email,
      subject: `Update on your campaign "${args.campaignTitle}"`,
      text: [
        `Hi ${args.name},`,
        "",
        `Your campaign "${args.campaignTitle}" was not approved.`,
        "",
        `Reason: ${args.reason}`,
        "",
        "Sign in to Dono to revise and resubmit.",
      ].join("\n"),
    });
  },
});

export const sendDonationReceipt = internalAction({
  args: {
    email: v.string(),
    campaignTitle: v.string(),
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.email,
      subject: `Thank you for supporting ${args.campaignTitle}`,
      text: [
        "Thank you for your donation on Dono.",
        "",
        `Campaign: ${args.campaignTitle}`,
        `Amount: ${args.currency.toUpperCase()} ${args.amount.toFixed(2)}`,
        "",
        "Your support helps students bring their projects to life.",
      ].join("\n"),
    });
  },
});

export const sendSocietyVerified = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    societyName: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.email,
      subject: `Your society "${args.societyName}" is verified`,
      text: [
        `Hi ${args.name},`,
        "",
        `"${args.societyName}" is now verified on Dono. You can start creating society campaigns.`,
      ].join("\n"),
    });
  },
});

export const sendSocietyRejected = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    societyName: v.string(),
    reason: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.email,
      subject: `Update on your society "${args.societyName}"`,
      text: [
        `Hi ${args.name},`,
        "",
        `Your society verification request for "${args.societyName}" was not approved.`,
        "",
        `Reason: ${args.reason}`,
      ].join("\n"),
    });
  },
});

export const sendSocietyJoinRequest = internalAction({
  args: {
    leaderEmail: v.string(),
    societyName: v.string(),
    studentName: v.string(),
    studentEmail: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.leaderEmail,
      subject: `New join request for ${args.societyName}`,
      text: [
        `${args.studentName} (${args.studentEmail}) requested to join ${args.societyName}.`,
        "",
        "Sign in to Dono to approve or reject the request.",
      ].join("\n"),
    });
  },
});

export const sendSocietyJoinApproved = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    societyName: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.email,
      subject: `You joined ${args.societyName}`,
      text: [
        `Hi ${args.name},`,
        "",
        `Your request to join "${args.societyName}" was approved.`,
      ].join("\n"),
    });
  },
});

export const sendSocietyCampaignPending = internalAction({
  args: {
    leaderEmail: v.string(),
    societyName: v.string(),
    campaignTitle: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.leaderEmail,
      subject: `Campaign awaiting society approval: ${args.campaignTitle}`,
      text: [
        `A new campaign "${args.campaignTitle}" needs your approval as a leader of ${args.societyName}.`,
        "",
        "Sign in to Dono to review it.",
      ].join("\n"),
    });
  },
});

export const sendCampaignFunded = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    campaignTitle: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendTransactionalEmail({
      to: args.email,
      subject: `Your campaign "${args.campaignTitle}" reached its goal`,
      text: [
        `Hi ${args.name},`,
        "",
        `Congratulations — "${args.campaignTitle}" has reached its funding goal.`,
      ].join("\n"),
    });
  },
});
