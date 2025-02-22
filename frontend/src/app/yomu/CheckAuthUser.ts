'use server';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

/**
 * 認可されたユーザーかどうかを確認する
 * @param param0 ユーザーアイコンのURL
 * @returns 認可されたユーザーかどうか
 */
export const checkAuthUser = async ({ iconUrl }: { iconUrl: string }): Promise<boolean> => {
  try {
    console.log(iconUrl);

    const res = await fetch(`${backendUrl}/isOurAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ icon_url: iconUrl }),
    });

    console.log(res);

    if (!res.ok) {
      return false;
    }

    const json = await res.json();

    return json.isOurAccount;
  } catch (error) {
    console.error(error);
    return false;
  }
};
