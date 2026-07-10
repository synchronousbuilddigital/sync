import dbConnect from "@/lib/mongodb";
import ProductionItem from "@/models/ProductionItem";
import PartnerLogo from "@/models/PartnerLogo";
import ProductionCategory from "@/models/ProductionCategory";
import ProductionGalleryItem from "@/models/ProductionGalleryItem";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    const [
      productionItems,
      partnerLogos,
      productionCategories,
      productionGalleryItems
    ] = await Promise.all([
      ProductionItem.find().sort({ index: 1, createdAt: -1 }),
      PartnerLogo.find().sort({ index: 1, createdAt: -1 }),
      ProductionCategory.find().sort({ index: 1, name: 1 }),
      ProductionGalleryItem.find().sort({ index: 1, createdAt: -1 }),
    ]);
    return Response.json({
      success: true,
      productionItems,
      partnerLogos,
      productionCategories,
      productionGalleryItems,
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
