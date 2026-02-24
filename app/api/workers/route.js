import db, { initDB } from "@/lib/db";

export async function POST(req) {
  try {
    await initDB();
    const body = await req.json();

    const {
      mobile, name, photo_url, age, gender, caste, religion,
      block_id, village, skill, custom_skill, is_agricultural,
      monthly_income, land_bigha, dependents, children,
      children_in_school, wife_work, disease, is_migrant,
      migrant_city, migrant_months, migrant_season, migrant_work,
      has_aadhar, has_labour_card, has_ration_card, has_ayushman,
      has_bank_account, has_jan_dhan, registration_source,
      activist_id, addictions,
    } = body;

    await db.execute({
      sql: `INSERT INTO workers (
        mobile, name, photo_url, age, gender, caste, religion,
        block_id, village, skill, custom_skill, is_agricultural,
        monthly_income, land_bigha, dependents, children,
        children_in_school, wife_work, disease, is_migrant,
        migrant_city, migrant_months, migrant_season, migrant_work,
        has_aadhar, has_labour_card, has_ration_card, has_ayushman,
        has_bank_account, has_jan_dhan, registration_source, activist_id
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        mobile, name, photo_url || null, age || null, gender, caste || null, religion || null,
        block_id || null, village || null, skill || null, custom_skill || null,
        is_agricultural ? 1 : 0, monthly_income || null, land_bigha || 0,
        dependents || 0, children || 0, children_in_school || 0,
        wife_work || null, disease || null, is_migrant ? 1 : 0,
        migrant_city || null, migrant_months || null, migrant_season || null,
        migrant_work || null, has_aadhar ? 1 : 0, has_labour_card ? 1 : 0,
        has_ration_card ? 1 : 0, has_ayushman ? 1 : 0,
        has_bank_account ? 1 : 0, has_jan_dhan ? 1 : 0,
        registration_source || "activist", activist_id || null,
      ],
    });

    if (addictions && addictions.length > 0) {
      for (const addiction of addictions) {
        await db.execute({
          sql: "INSERT INTO worker_addictions (worker_mobile, addiction_type) VALUES (?, ?)",
          args: [mobile, addiction],
        });
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initDB();
    const result = await db.execute(`
      SELECT w.*, b.name as block_name
      FROM workers w
      LEFT JOIN blocks b ON w.block_id = b.id
      ORDER BY w.created_at DESC
    `);
    return Response.json(result.rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}