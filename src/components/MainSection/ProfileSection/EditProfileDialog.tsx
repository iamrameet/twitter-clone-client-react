import { useContext, useRef, useState } from "react";
import { updateUser } from "../../../scripts/user";
import Button from "../../Button";
import DialogBox, { DialogBoxProperties } from "../../DialogBox";
import { UserContext } from "../../context/AuthUser";
import Input, { FileInput } from "../../Input";
import FetchRequest from "../../../scripts/fetch-request";
import { sleep } from "../../../scripts/util";

export function EditProfileDialog({ closeHandle }: { closeHandle: (index: number) => void }){

  const { userData, updateUserData } = useContext(UserContext);

  const [ name, setName ] = useState(userData?.name ?? "");
  const [ bio, setBio ] = useState(userData?.bio ?? "");
  const [ location, setLocation ] = useState(userData?.location ?? "");
  const [ website, setWebsite ] = useState(userData?.website ?? "");

  const [ imageFile, setImageFile ] = useState<File>();
  const [ coverFile, setCoverFile ] = useState<File>();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [ image, setImage ] = useState(userData?.image);
  const [ cover, setCover ] = useState(userData?.cover);

  const [ isSaving, setSaving ] = useState(false);

  return <DialogBox
    id="edit-profile"
    title="Edit profile"
    closeHandle={ () => closeHandle(0) }
    headerButtons={[
      <Button
        isMono={ true }
        emphasis="high"
        disabled={ isSaving }
        spinner={ true }
        onClick={
          async () => {
            setSaving(true);
            try{
              const update = await updateUser({
                name, bio, location, website,
                image: imageFile,
                cover: coverFile
              });
              updateUserData(Object.assign({}, update));
              closeHandle(0);
            } catch(ex) {}
            setSaving(false);
          }
        }
      >Save</Button>
    ]}
  >
    <FileInput
      accept="image/*"
      ref={ imageInputRef }
      onSelect={ files => {
        setImageFile(files[0]);
        setImage(URL.createObjectURL(files[0]));
      } }
    />
    <FileInput
      accept="image/*"
      ref={ coverInputRef }
      onSelect={ files => {
        setCoverFile(files[0]);
        setCover(URL.createObjectURL(files[0]));
      } }
    />

    <div
      className="container w-fill cover"
      style={{ backgroundImage: `url("${ cover }")` }}
      onClick={ () => coverInputRef.current?.click() }
    ></div>

    <div className="container row pad">
      <img
        className="container image"
        src={ image }
        onClick={ () => imageInputRef.current?.click() }
      />
    </div>

    <div className="container w-fill">

      <Input id="profile-name" name="name" placeholder="Name"
        value={ name }
        onChange={ ({ currentTarget }) => setName(currentTarget.value) }
      />
      <Input id="profile-bio" name="bio" placeholder="Bio"
        value={ bio }
        onChange={ ({ currentTarget }) => setBio(currentTarget.value) }
      />
      <Input id="profile-location" name="location" placeholder="Location"
        value={ location }
        onChange={ ({ currentTarget }) => setLocation(currentTarget.value) }
      />
      <Input id="profile-website" name="website" placeholder="Website"
        value={ website }
        onChange={ ({ currentTarget }) => setWebsite(currentTarget.value) }
      />

    </div>

  </DialogBox>
}