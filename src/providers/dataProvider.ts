import { dataProvider as supabaseDataProvider } from "@refinedev/supabase";
import { supabase } from "@/integrations/supabase/client";

export const dataProvider = supabaseDataProvider(supabase);
