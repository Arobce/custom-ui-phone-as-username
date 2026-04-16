"use server";

import { Widget } from "../../../../components/widget";
import { type KindePageEvent } from "@kinde/infrastructure";
import { getKindeNonce, getKindeRequiredJS, getKindeRegisterUrl } from "@kinde/infrastructure";
import React from "react";
import { renderToString } from "react-dom/server.browser";
import { DefaultLayout } from "../../../../layouts/default";
import { Root } from "../../../../root";
import { getPhoneFieldScript } from "../../../../utils/phoneFieldScript";

const DefaultPage: React.FC<KindePageEvent> = ({ context, request }) => {
  const nonce = getKindeNonce();
  
  return (
    <Root context={context} request={request}>
      {getKindeRequiredJS()}
      <DefaultLayout>
        <Widget heading={context.widget.content.heading} />
      </DefaultLayout>
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: getPhoneFieldScript(),
        }}
      />
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var registerUrl = "${getKindeRegisterUrl()}";

              function checkForNoAccountError() {
                var errorEl = document.getElementById("sign_up_sign_in_credentials_p_email_username_error_msg");
                if (errorEl && errorEl.textContent.trim() === "No account found with this email") {
                  window.location.href = registerUrl;
                }
              }

              var observer = new MutationObserver(function() {
                checkForNoAccountError();
              });

              observer.observe(document.body, { childList: true, subtree: true });

              // Also check immediately in case it's already rendered
              checkForNoAccountError();
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
