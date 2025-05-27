import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: localStorage
  }
});

export const getPrices = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true);

  if (error) {
    console.error("获取数据失败:", error);
  }
  console.log("data", data);

  const pricing =
    data
      ?.map((item) => {
        return {
          ...item,
          price: item.prices[0].unit_amount / 100,
          priceId: item.prices[0].id,
          features: item.marketing_features.map((item) => item.name),
          buttonText: "Get Started",
          highlight: item.metadata?.highlight,
        };
      })
      .sort((a, b) => a.price - b.price) ?? [];
  return pricing;
}

export type ContantMessage = {
  name: string;
  email: string;
  message: string;
  subject: string;
}
export const createContactMessage = async (data: ContantMessage) => {
  const { error } = await supabase.from("contact_messages").insert([data]);

  if (error) {
    console.error("create contact message failed:", error);
  }
  console.log("data", data);

  return data;
};
