<div class="form-group {{ $errors->has('name') ? 'has-error' : ''}}">
    <label for="name" class="control-label">{{ 'Name' }}</label>
    <input class="form-control" name="name" type="text" id="name" value="{{ isset($users->name) ? $users->name : ''}}" >
    {!! $errors->first('name', '<p class="help-block">:message</p>') !!}
</div>
<div class="form-group {{ $errors->has('email') ? 'has-error' : ''}}">
    <label for="email" class="control-label">{{ 'Email' }}</label>
    <input class="form-control" rows="5" name="email" type="textarea" id="email" value="{{ isset($users->email) ? $users->email : ''}}">
    {!! $errors->first('email', '<p class="help-block">:message</p>') !!}
</div>
<div class="form-group {{ $errors->has('provider') ? 'has-error' : ''}}">
    <label for="provider" class="control-label">{{ 'Provider' }}</label>
    <input class="form-control" rows="5" name="provider" type="textarea" id="provider" value="{{ isset($users->provider) ? $users->provider : ''}}">
    {!! $errors->first('provider', '<p class="help-block">:message</p>') !!}
</div>
<div class="form-group {{ $errors->has('unique_id') ? 'has-error' : ''}}">
    <label for="unique_id" class="control-label">{{ 'Unique Id' }}</label>
    <input class="form-control" rows="5" name="unique_id" type="textarea" id="unique_id"  value="{{ isset($users->unique_id) ? $users->unique_id : ''}}">
    {!! $errors->first('unique_id', '<p class="help-block">:message</p>') !!}
</div>
<div class="form-group {{ $errors->has('id') ? 'has-error' : ''}}">
    <label for="id" class="control-label">{{ 'Id' }}</label>
    <input class="form-control" name="id" type="number" id="id" value="{{ isset($users->id) ? $users->id : ''}}" >
    {!! $errors->first('id', '<p class="help-block">:message</p>') !!}
</div>

<div class="form-group">
  <label for="">Roles</label>
  <select class="form-control" name="roles[]" id="" multiple>
    @foreach ( \Spatie\Permission\Models\Role::all() as $role)
    <option value={{ $role->id }} {{ ($users->roles->contains($role->id))?"SELECTED":null }}>{{ $role->name }}</option>

    @endforeach
    </select>
</div>

<div class="form-group">
  <label for="">Permissions</label>
  <select class="form-control" name="permissions[]" id="" multiple>
    @foreach ( \Spatie\Permission\Models\Permission::all() as $permission)
    <option value={{ $permission->id }} {{ ($users->permissions->contains($permission->id))?"SELECTED":null }}>{{ $permission->name }}</option>
  
    @endforeach
    </select>
</div>

<div class="form-group">
    <input class="btn btn-primary" type="submit" value="{{ $formMode === 'edit' ? 'Update' : 'Create' }}">
</div>
