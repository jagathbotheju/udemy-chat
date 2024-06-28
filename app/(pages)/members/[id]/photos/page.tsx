import prisma from "@/lib/prisma";
import { CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import { Photo } from "@prisma/client";

interface Props {
  params: {
    id: string;
  };
}

const PhotosPage = async ({ params }: Props) => {
  const member = await prisma.member.findUnique({
    where: {
      userId: params.id,
    },
    select: {
      photos: true,
    },
  });
  const photos = member?.photos.map((photo) => photo) as Photo[];

  if (!photos)
    return (
      <h1 className="text-xl font-semibold py-5 px-10 border border-red-600 rounded-md">
        Photos Not Found!
      </h1>
    );

  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        Photos
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-5 gap-3">
          {photos.map((photo) => (
            <div key={photo.id}>
              <Image
                width={300}
                height={300}
                src={photo.url}
                alt="member image"
                className="object-cover aspect-square"
              />
            </div>
          ))}
        </div>
      </CardBody>
    </>
  );
};

export default PhotosPage;
