import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

async function setup() {
  console.log("Checking storage buckets...")
  const { data: buckets, error: listError } =
    await supabaseAdmin.storage.listBuckets()

  if (listError) {
    console.error("Error listing buckets:", listError.message)
    return
  }

  const avatarsExists = buckets.some((b) => b.name === "avatars")
  if (!avatarsExists) {
    console.log("Creating 'avatars' bucket...")
    const { error: createError } = await supabaseAdmin.storage.createBucket(
      "avatars",
      {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
      }
    )

    if (createError) {
      console.error("Failed to create bucket:", createError.message)
    } else {
      console.log("Successfully created public 'avatars' bucket!")
    }
  } else {
    console.log("'avatars' bucket already exists.")
  }
}

setup()
