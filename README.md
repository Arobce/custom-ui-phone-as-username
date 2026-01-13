# 🐾 Bark & Bite - Phone Authentication - Kinde Custom UI

A fully customizable phone-as-username authentication UI template built with React Server Components and Kinde's Custom UI feature. Complete control over phone authentication flows with E.164 validation and country code selection.

![Bark & Bite](image.png)

## Features

- 🎯 Full control over auth UI design and layout
- 🚀 Built with React Server Components
- 🔒 Kinde Authentication integration
- 📱 Responsive design out of the box
- 📞 **Phone Number Registration** - Transform username field into a phone input with country code selector
- ✅ **Phone Validation Workflow** - E.164 format validation for international phone numbers
- 🔄 **Smart Back-Navigation** - Preserves phone number and country code when users navigate back

## Prerequisites

- npm or yarn
- A Kinde account with Custom UI feature enabled

## Quick Start

1. **Fork the Repository** - Click "Use this template" > "Create a new repository" on GitHub
2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/custom-ui-barknbite.git
   cd custom-ui-barknbite
   ```
3. **Connect to Kinde**
   - Go to your Kinde Dashboard > Settings > Git repo
   - Select "Connect GitHub" and authorize
   - Select your forked repository
4. **Deploy** - Kinde automatically deploys from your connected repository on each push

**Note:** Your directory structure must follow the Kinde custom UI format (as shown in Project Structure above)

## Customization Guide

### Page Layouts

The template includes customizable layouts for all authentication pages:

- Sign In
- Sign Up
- Password Reset
- Email Verification
- Multi-factor Authentication
- Social Authentication
- Error Pages
- And more...

Each layout can be customized in the `kindeSrc/enviroment/pages/(kinde)` directory.

## Project Structure

```
📂 splitScape
├── 📂 kindeSrc
│   ├── 📂 environment
│   │   ├── 📂 pages
│   │   │   ├── ⚛️ layout.tsx
│   │   │   ├── 📄 styles.ts
│   │   │   └── 📂 (kinde)
│   │   │       └── 📂 (default)
│   │   │           └── ⚛️ page.tsx
│   │   └── 📂 workflows
│   │       └── 📄 UsernameValidationWorkflow.ts (Phone validation)
│   └── 📂 utils
│       └── 📄 phoneFieldScript.ts (Phone field UI transformation)
└── 📄 kinde.json

```

## Phone Number Authentication

This template includes an integrated phone number authentication system for the registration and login flows:

### Components

1. **Phone Field Transformation** (`kindeSrc/utils/phoneFieldScript.ts`)
   - Converts the standard username field into a phone input with country code selector
   - Supports 18 countries with flag emojis for better UX
   - Handles back-navigation by parsing and splitting phone numbers with country codes
   - Combines country code + phone digits into E.164 format on submission

2. **Phone Validation Workflow** (`kindeSrc/workflows/user-validation/Workflow.ts`)
   - Validates phone numbers in E.164 format (e.g., `+14318445546`)
   - Requires country code prefix and 1-15 digits
   - Returns clear error messages for invalid formats

### How It Works

1. User selects country code from dropdown
2. User enters phone digits (displayed without country code)
3. On form submission:
   - Script combines country code + digits → `+14215550125`
   - Sent to backend as the "username" field
   - Workflow validates against E.164 format
4. Accepted users proceed to email verification

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Need help? Here are some resources:

- Check out the [video demos](https://www.loom.com/share/folder/4398af02bbde4f498952ab4654a331a3) for implementation examples
- Join the [Kinde Community](https://community.kinde.com)
- Open an issue on GitHub
- Review the [Kinde documentation](https://docs.kinde.com)
