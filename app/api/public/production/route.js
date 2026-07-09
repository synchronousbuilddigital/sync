import dbConnect from "@/lib/mongodb";
import ProductionItem from "@/models/ProductionItem";
import PartnerLogo from "@/models/PartnerLogo";
import ProductionCategory from "@/models/ProductionCategory";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    const productionItems = await ProductionItem.find().sort({ index: 1, createdAt: -1 });
    const partnerLogos = await PartnerLogo.find().sort({ index: 1, createdAt: -1 });
    const productionCategories = await ProductionCategory.find().sort({ index: 1, name: 1 });
    return Response.json({ success: true, productionItems, partnerLogos, productionCategories });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
