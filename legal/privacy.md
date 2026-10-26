<!--
Privacy policy changelog at the bottom of the file. These comments are human readable
comments. They are not part of the privacy policy itself, nor are they legally binding.
They are for the benefit of readers who want to see a history of changes.
-->

# Privacy Policy

> [!NOTE]
> **Last updated:** 26/10/2026 <br/>
> **Contact:** contact@ets2la.com

ETS2LA is an open source project. This policy explains what
happens to your data when you use the ETS2LA application or this website.

> [!NOTE]
> ETS2LA itself is, and will remain, free. Optional paid subscriptions are
> only planned for server-side features that cost us money to run, never for
> any self-driving features.

## Summary

- We do **not** collect personal information such as your name, address, email
  or phone number.
- We do **not** use advertising, tracking pixels, or third-party analytics on
  this website.
- We do **not** sell your data or share it for marketing. It is only handled by
  the providers needed to run ETS2LA, and between our two regional services as
  described below.

## Who we are

ETS2LA is developed by the **ETS2LA Developers**, a project operated by
**Tuomas K**. For any privacy question, or to exercise the rights described
below, contact us at:

**contact@ets2la.com**

The controller responsible for data processing is the ETS2LA Developers,
operated by Tuomas K. Our full legal name is available on
request at the address above.

<!-- 
Once paddle is live I'll replace "Tuomas K" with a Finnish 
business name (toiminimi) and registration (Y-tunnus).
For now I'm doing this to not put my name out there without
valid request.
-->

That covers `ets2la.com` and the ETS2LA application. The separate
`ets2la.cn` service is operated by a different team, see
[Our China service](/#/legal/privacy#our-china-service).

## What we collect

### This website

This website does not set third party cookies, does not use analytics, and does 
not build a profile of you. Pages are served statically.

### The ETS2LA application

- **Account data** - if you choose to create an account, we store a username,
  an internal account ID, your role, and an authentication secret used to
  generate your one-time passwords. We never ask for or store a password.
- **Technical logs / metrics** - we collect technical information about your device,
  such as its operating system, number of CPU cores, RAM as well as the version of 
  ETS2LA you are running. Additionally we collect usage based metrics such as a persistent
  unique identifier for your installation, your currently selected language and additional
  one time events such as crashes. You are free to opt-out of this telemetry
  by disabling the 'Anonymous Telemetry' option in the application settings.
- **Information requests** - requests for the plugin list or similar information, 
  which necessarily see your IP address as part of serving the request.

### Subscriptions

Paid subscriptions are optional and are not yet available. When they launch,
the following will apply:

- Subscriptions are sold and processed by **Paddle.com** acting as Merchant of
  Record. Paddle is the seller of the subscription, not only a payment processor.
- **We never see or store your payment details.** Card numbers, billing
  addresses and similar payment data go directly to Paddle and are governed by
  [Paddle's privacy policy](https://www.paddle.com/legal/privacy).
- From Paddle we receive only what is needed to know whether your subscription
  is active: a customer identifier, a subscription identifier, its status and
  its renewal date. We link this to your ETS2LA account.
- Paddle may contact you directly about your purchase, for example receipts,
  renewal reminders, or changes to their terms.

## Why we process it

We only process data where we have a lawful basis under the GDPR:

| Data | Lawful basis |
| --- | --- |
| Account data | Performance of a contract (Art. 6(1)(b)) - you need an account to use server-side features. |
| Subscription status | Performance of a contract (Art. 6(1)(b)) - we need to know whether your subscription is active. |
| Technical logs / metrics | Legitimate interests (Art. 6(1)(f)) - operating and securing the service. |

## How long we keep it

- Account data is kept until you delete your account. You can do this at any
  time from inside the ETS2LA application, or from the account page on this
  website. Deletion is immediate and cannot be undone.
- Subscription records are kept by Paddle for as long as their own legal and
  accounting obligations require. We keep the linked subscription status only
  while your account exists.
- Technical logs are kept for 1 year, after which they are automatically deleted.

## Cookies and local storage

This website stores a single item in your browser's `localStorage` if you log
in, so that you stay signed in between visits. It contains your session token
and is removed when you sign out. This is strictly necessary for the feature to
work, so it does not require consent under the ePrivacy Directive.

## Sharing

We do not sell your data. We do not share it with third parties for marketing.
Data is only processed by the providers necessary to run the service:

- **Paddle.com** - payment and subscription processing. Paddle acts as
  Merchant of Record, so for the purchase itself Paddle is the seller and an
  independent controller rather than our processor.
- **Website and network providers** - GitHub Pages serves this website, and
  Cloudflare provides DDoS protection, caching and a CDN for downloads.
  Delivering a request necessarily exposes your IP address to them.
- **OVHCloud** - hosts the ETS2LA API and plugin list, on a server in Poland.

None of these providers receive your account data, your token, or your
telemetry beyond what is unavoidable to deliver the request.

## International transfers

Our API and the plugin list are hosted on OVHCloud infrastructure in Poland, so
that data stays inside the EEA. Paddle is established in the United Kingdom,
which the European Commission recognises as providing adequate protection.

GitHub and Cloudflare are US companies, so delivering this website and
protecting it in transit involves processing your IP address in the United
States. Those transfers rely on the **EU-US Data Privacy Framework**, under
which both are certified, and on the **Standard Contractual Clauses** as a
fallback.

## Our China service

ETS2LA is served from two domains. `ets2la.com` is used outside China, and
`ets2la.cn` is used inside China. The following information is shared between
the two services:

| | `ets2la.com` | `ets2la.cn` |
| --- | --- | --- |
| Account and subscription data | Yes | Yes |
| Technical logs / telemetry | Yes | **No** |

**Who operates `ets2la.cn`.** It is run by **goodnightan**, who is an
independent controller for the traffic it serves and publishes their own
privacy policy at https://docs.ets2la.cn/service-privacy/. We share the account 
database with them, but each of us answers for the data we collect ourselves.

**What is shared.** Both services read and write the same account database, so
your account, its role and its subscription status are the same whichever one
you use. This is deliberate as you should not need two accounts, and a
subscription should not stop working because you travelled.

**What is not shared.** Telemetry is stored only on `ets2la.com`. None of the
technical logs or metrics described above reach `ets2la.cn`, and it does not
collect them itself.

**Cross-border transfer.** Because the account database is shared, the two 
services exchange data across the Chinese border in both directions:
- **Data leaving China.** The operator of `ets2la.cn` currently falls within the exemption under Article 5 of China's Provisions on Promoting and Regulating Cross-Border Data Flows, which exempts processors transferring personal information of fewer than 100,000 individuals (excluding sensitive personal information) from the standard contract, security assessment and certification requirements. `ets2la.cn` therefore does not rely on a CAC-filed standard contract for the transfer. Instead, it obtains your separate consent after informing you of the overseas recipient's identity, the purpose and categories of the transferred data, and how to exercise your rights against the recipient, as PIPL Article 39 requires. This exemption does not affect our obligation to complete a personal information protection impact assessment before the transfer.
- **Data accessed from outside China.** On our side, access from outside China is covered by the Standard Contractual Clauses where applicable under the laws governing `ets2la.com`.

For more information about how `ets2la.cn` handles your personal information, including cross-border transfers, please see their privacy policy at https://docs.ets2la.cn/service-privacy/.

## Your rights

Under the GDPR you have the right to:

- **Access** the personal data we hold about you.
- **Rectify** data that is inaccurate.
- **Erase** your data ("right to be forgotten").
- **Restrict** or **object** to processing.
- **Portability** - receive your data in a machine-readable format.
- **Complain** to your local data protection authority.

Because we hold very little data, most of these are exercised by deleting your
account. To make any other request, contact us at **contact@ets2la.com**. We
will respond within one month.

> [!NOTE]
> Requests about a purchase itself, that is, refunds, receipts, or the payment details
> you gave Paddle, are handled by Paddle, since they are the seller. See
> [Paddle's privacy policy](https://www.paddle.com/legal/privacy) or contact
> Paddle support directly.

## Children

ETS2LA is not directed at children under 16, and we do not knowingly collect
data from them.

## Security

Account secrets are stored hashed, and authentication uses one-time passwords
rather than reusable passwords. No system is perfectly secure, but we hold as
little data as possible so that a breach would expose as little as possible.

## Changes

If this policy changes in a way that materially affects you, we will note it in
the application's release notes and update the date at the top of this page. Additionally
we will keep a changelog of the privacy policy in the 
[GitHub repository](https://github.com/ETS2LA/website/blob/main/legal/privacy.md).

## Open source

Because ETS2LA is open source, you can verify that the code that talks to our servers
does what it's supposed to. See the
[GitHub repository](https://github.com/ETS2LA/ETS2LA).


<!--
26/10/2026 - Initial version.
-->