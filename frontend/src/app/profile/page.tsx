"use client";
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProfileSettings = () => {
  const session = useSession();
  const [image, setImage] = useState(session.data?.user?.image || "");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center py-10">
      {session.status === 'authenticated' ? (
        <Card className="w-full max-w-xl border-[2px] border-gray-300 bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl shadow-lg">
          <CardHeader className="text-center text-xl font-semibold text-gray-700 py-4 border-b border-gray-300">
            プロフィール設定
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              {image && (
                <Image
                  src={image}
                  alt="プロフィール画像"
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-gray-300"
                />
              )}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button className="bg-blue-500 text-white rounded-lg py-1 px-3 hover:bg-blue-600">
                  画像を変更
                </Button>
              </label>
              <div className="space-y-2 w-full">
                <Label htmlFor="name" className="text-gray-700">名前 {session.data.user?.name}</Label>
                <Input id="name" placeholder="名前の変更" className="rounded-lg border-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">メールアドレス</Label>
              <Input id="email" placeholder="メールアドレス" className="rounded-lg border-gray-400" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700">自己紹介</Label>
              <Textarea id="bio" placeholder="自己紹介" className="rounded-lg border-gray-400" />
            </div>

            <Button className="w-full bg-amber-500 text-white rounded-lg py-2 mt-4 hover:bg-amber-600">保存</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-gray-700">ログインしてください。</div>
      )}
    </div>
  );
};

export default ProfileSettings;