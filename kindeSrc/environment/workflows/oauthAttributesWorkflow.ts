import {
    WorkflowSettings,
    WorkflowTrigger,
    createKindeAPI,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
    id: "mapEntraIdClaims",
    name: "MapEntraIdClaims",
    failurePolicy: {
        action: "stop",
    },
    trigger: WorkflowTrigger.PostAuthentication,
    bindings: {
        "kinde.env": {},
        "url": {}
    },
};

export default async function mapEntraIdClaimsWorkflow(
    event: any
) {
    const provider = event.context?.auth?.provider;
    const protocol = provider?.protocol || "";


    // Only process OAuth2 connections from Entra ID (Microsoft)
    if (protocol !== "oauth2") {
        console.log("Not an OAuth2 authentication, skipping claims mapping");
        return;
    }

    console.log("Event");
    console.log(event);
}