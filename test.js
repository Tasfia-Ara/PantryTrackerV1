
import * as dotenv from 'dotenv'
dotenv.config()
import {OpenAI} from 'openai'
import fs from "fs"

//check out this link: https://platform.openai.com/docs/guides/vision?lang=node

const openai = new OpenAI();

const base64encoded = fs.readFileSync("images/apple.png", {
    encoding: "base64"
})

async function main() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: "Create a JSON structure for all the items in the image. Return only the name of the object, delete any other JSON format." },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${base64encoded}`,
            },
          },
        ],
      },
    ],
  });
  console.log(base64encoded)
  console.log(response.choices[0].message.content);
}
main();