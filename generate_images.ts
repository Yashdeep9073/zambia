import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

async function generateImage(prompt: string, filename: string, aspectRatio: string = "1:1") {
  console.log(`Generating image for: ${filename}`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const buffer = Buffer.from(base64EncodeString, 'base64');
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filename, buffer);
        console.log(`Saved ${filename}`);
      }
    }
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
  }
}

async function main() {
  const icons = [
    {
      prompt: "Ultra-realistic 3D icon: Laptop or tablet with an online application form being submitted, glowing 'Submit' button. Digital form UI, cursor clicking submit, futuristic blue glow. Ultra high-definition 8K, clean 3D glass, gradient, futuristic style, highly professional, consistent lighting.",
      filename: "public/assets/icons/journey/1-apply.png"
    },
    {
      prompt: "Ultra-realistic 3D icon: Shield with a green checkmark and academic documents. Document checklist, verification tick, secure badge. Ultra high-definition 8K, clean 3D glass, gradient, futuristic style, highly professional, consistent lighting.",
      filename: "public/assets/icons/journey/2-eligibility.png"
    },
    {
      prompt: "Ultra-realistic 3D icon: Official acceptance letter with large stamp reading 'ACCEPTED – 100% SCHOLARSHIP'. Gold seal stamp, university crest, document envelope opening. Ultra high-definition 8K, clean 3D glass, gradient, futuristic style, highly professional, consistent lighting.",
      filename: "public/assets/icons/journey/3-offer.png"
    },
    {
      prompt: "Ultra-realistic 3D icon: Student clicking 'Accept Offer' on a digital screen. Confirmation screen, green confirmation tick, student silhouette celebrating. Ultra high-definition 8K, clean 3D glass, gradient, futuristic style, highly professional, consistent lighting.",
      filename: "public/assets/icons/journey/4-acceptance.png"
    },
    {
      prompt: "Ultra-realistic 3D icon: Passport with Indian visa stamp. Passport open, visa stamp, airplane watermark in background. Ultra high-definition 8K, clean 3D glass, gradient, futuristic style, highly professional, consistent lighting.",
      filename: "public/assets/icons/journey/5-visa.png"
    },
    {
      prompt: "Ultra-realistic 3D icon: Airplane flying from Africa to India on a glowing map. Flight trail line, map connection, airplane mid-flight. Ultra high-definition 8K, clean 3D glass, gradient, futuristic style, highly professional, consistent lighting.",
      filename: "public/assets/icons/journey/6-fly.png"
    }
  ];

  for (const icon of icons) {
    await generateImage(icon.prompt, icon.filename);
  }

  await generateImage(
    "Ultra-realistic 8K image: An African female student sitting in an ultra-modern Indian classroom during a live lecture. Smart classroom environment, Indian and African students studying together, digital smart board / interactive screen, professor teaching in the background, African female student in the foreground taking notes, bright natural lighting, modern university setting, professional education environment, inspirational tone, high clarity.",
    "public/assets/images/landing/zii-advantage.png",
    "16:9"
  );
}

main();
