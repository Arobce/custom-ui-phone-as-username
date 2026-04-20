"use server";

import { type KindePageEvent } from "@kinde/infrastructure";
import { getKindeNonce } from "@kinde/infrastructure";
import React from "react";
import { renderToString } from "react-dom/server.browser";
import { Widget } from "../../../../components/widget";
import { DefaultLayout } from "../../../../layouts/default";
import { Root } from "../../../../root";

const DefaultPage: React.FC<KindePageEvent> = ({ context, request }) => {
  const nonce = getKindeNonce();

  return (
    <Root context={context} request={request}>
      <DefaultLayout>
        <Widget heading={context.widget.content.heading} />
      </DefaultLayout>
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              console.log("Base inline script executed on default page");

              async function runExampleApiCall() {
                try {
                  var response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
                  if (!response.ok) {
                    throw new Error("Example API call failed with status " + response.status);
                  }

                  var result = await response.json();
                  console.log("Example API response:", result);
                } catch (error) {
                  console.error("Example API error:", error);
                }
              }

              if (document.readyState === "complete") {
                runExampleApiCall();
              } else {
                window.addEventListener("load", runExampleApiCall, { once: true });
              }
            })();
          `,
        }}
      />
    </Root>
  );
};

// Page Component
export default async function Page(event: KindePageEvent): Promise<string> {
  const page = await DefaultPage(event);
  return renderToString(page);
}
