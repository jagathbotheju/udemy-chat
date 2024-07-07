"use client";
import DeleteButton from "@/components/DeleteButton";
import ImageUploadButton from "@/components/ImageUploadButton";
import StarButton from "@/components/StarButton";
import { CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import { Member, Photo, User } from "@prisma/client";
import { MdDelete, MdOutlineAddAPhoto } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

interface Props {
  authUser: User;
  member: Member & {
    photos: Photo[];
  };
}

const MyPhotos = ({ authUser, member }: Props) => {
  console.log("MyPhotos", authUser);

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h3 className="text-2xl font-semibold text-secondary">My Photos</h3>
          {authUser && authUser.id === member.userId && <ImageUploadButton />}
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {member.photos ? (
          <div className="grid grid-cols-5 gap-3">
            {member.photos.map((photo) => {
              // console.log(photo);
              return (
                <div key={photo.id} className="relative">
                  <Image
                    width={300}
                    height={300}
                    src={photo.url}
                    alt="member image"
                    className="object-cover aspect-square"
                  />
                  <div className="absolute top-3 left-3 z-50">
                    <StarButton
                      selected={true}
                      loading={false}
                      mainPhoto={member.image}
                      photo={photo.url}
                    />
                  </div>
                  <div className="absolute top-3 right-3 z-50">
                    <DeleteButton photo={photo} profilePhoto={member.image} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-md p-10 shadow-md">
            <h3 className="font-semibold text-3xl">Photos Not Found</h3>
          </div>
        )}
      </CardBody>
    </>
  );
};

export default MyPhotos;
